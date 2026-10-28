#!/usr/bin/env zsh

_time_taken_prepare_or_restore() {
  emulate -L zsh

  local command_name="$1"
  local zshrc="$HOME/.zshrc"
  local backup="${zshrc}.time_taken_backup"
  local minimal="${zshrc}.time_taken_minimal.$$"
  local marker="# time_taken benchmark shell"
  local first_line

  if [[ -e "$backup" ]]; then
    if [[ "${TIME_TAKEN_SETUP_SHELL_PID:-}" == "$$" ]]; then
      echo "The benchmark is ready, but it must run in a new terminal." >&2
      echo "Open a new terminal and run ${command_name} there." >&2
      return 1
    fi

    if [[ ! -f "$zshrc" ]] || ! IFS= read -r first_line < "$zshrc" || [[ "$first_line" != "$marker" ]]; then
      echo "Refusing to overwrite $zshrc because $backup already exists and the active .zshrc is not the benchmark file." >&2
      echo "Resolve the two files manually, then retry." >&2
      return 1
    fi

    if ! command mv "$backup" "$zshrc"; then
      echo "Could not restore $zshrc; benchmark aborted." >&2
      return 1
    fi

    unset TIME_TAKEN_SETUP_SHELL_PID
    echo "Restored $zshrc. Measuring it from this clean terminal..."
    return 0
  fi

  if [[ ! -f "$zshrc" ]]; then
    echo "Cannot prepare benchmark: $zshrc does not exist." >&2
    return 1
  fi

  if ! {
    print -r -- "$marker"
    print -r -- "typeset -g TIME_TAKEN_SETUP_SHELL_PID=$$"
    print -r -- 'source "$HOME/.dotfiles/.time_taken_functions.sh"'
  } > "$minimal"; then
    command rm -f "$minimal"
    echo "Could not create the temporary benchmark .zshrc." >&2
    return 1
  fi

  if ! command mv "$zshrc" "$backup"; then
    command rm -f "$minimal"
    echo "Could not rename $zshrc; benchmark setup aborted." >&2
    return 1
  fi

  if ! command mv "$minimal" "$zshrc"; then
    command mv "$backup" "$zshrc"
    command rm -f "$minimal"
    echo "Could not install the minimal .zshrc; the original was restored." >&2
    return 1
  fi

  typeset -g TIME_TAKEN_SETUP_SHELL_PID=$$
  echo "Renamed $zshrc to $backup."
  echo "Installed a minimal $zshrc that only loads time_taken and time_taken_info."
  echo "Open a new terminal and run ${command_name} there. The original .zshrc will be restored before it is measured."
  return 2
}

time_taken() {
  _time_taken_prepare_or_restore time_taken
  local prepare_status=$?

  (( prepare_status == 2 )) && return 0
  (( prepare_status == 0 )) || return "$prepare_status"

  time (source "$HOME/.zshrc")
}

time_taken_info() {
  _time_taken_prepare_or_restore time_taken_info
  local prepare_status=$?

  (( prepare_status == 2 )) && return 0
  (( prepare_status == 0 )) || return "$prepare_status"

  time (
    zmodload zsh/zprof || return 1
    zprof -c

    source "$HOME/.zshrc"
    local source_status=$?

    zprof
    return "$source_status"
  )
}
