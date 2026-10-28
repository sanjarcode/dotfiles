#!/usr/bin/env zsh

_time_taken_paths() {
  emulate -L zsh

  typeset -g TIME_TAKEN_ZSHRC="$HOME/.zshrc"
  typeset -g TIME_TAKEN_BACKUP="${TIME_TAKEN_ZSHRC}.time_taken_backup"
  typeset -g TIME_TAKEN_MARKER="# time_taken benchmark shell"
}

_time_taken_require_active() {
  emulate -L zsh

  _time_taken_paths

  if [[ ! -f "$TIME_TAKEN_BACKUP" ]]; then
    echo "Shell startup benchmarking is not active. Run time_taken_start first." >&2
    return 1
  fi

  local first_line
  if [[ ! -f "$TIME_TAKEN_ZSHRC" ]] || ! IFS= read -r first_line < "$TIME_TAKEN_ZSHRC" || [[ "$first_line" != "$TIME_TAKEN_MARKER" ]]; then
    echo "Benchmark backup exists, but $TIME_TAKEN_ZSHRC is not the expected minimal file." >&2
    echo "Resolve $TIME_TAKEN_ZSHRC and $TIME_TAKEN_BACKUP manually before continuing." >&2
    return 1
  fi
}

time_taken_start() {
  emulate -L zsh

  _time_taken_paths

  local minimal="${TIME_TAKEN_ZSHRC}.time_taken_minimal.$$"
  local first_line

  if [[ -e "$TIME_TAKEN_BACKUP" ]]; then
    if [[ ! -f "$TIME_TAKEN_ZSHRC" ]] || ! IFS= read -r first_line < "$TIME_TAKEN_ZSHRC" || [[ "$first_line" != "$TIME_TAKEN_MARKER" ]]; then
      echo "Refusing to overwrite $TIME_TAKEN_ZSHRC because $TIME_TAKEN_BACKUP already exists and the active .zshrc is not the benchmark file." >&2
      echo "Resolve the two files manually, then retry." >&2
      return 1
    fi

    echo "Shell startup benchmarking is already active."
    echo "Run time_taken or time_taken_info as often as needed, then run time_taken_end."
    return 0
  fi

  if [[ ! -f "$TIME_TAKEN_ZSHRC" ]]; then
    echo "Cannot prepare benchmark: $TIME_TAKEN_ZSHRC does not exist." >&2
    return 1
  fi

  if ! {
    print -r -- "$TIME_TAKEN_MARKER"
    print -r -- 'source "$HOME/.dotfiles/.time_taken_functions.sh"'
  } > "$minimal"; then
    command rm -f "$minimal"
    echo "Could not create the temporary benchmark .zshrc." >&2
    return 1
  fi

  if ! command mv "$TIME_TAKEN_ZSHRC" "$TIME_TAKEN_BACKUP"; then
    command rm -f "$minimal"
    echo "Could not rename $TIME_TAKEN_ZSHRC; benchmark setup aborted." >&2
    return 1
  fi

  if ! command mv "$minimal" "$TIME_TAKEN_ZSHRC"; then
    command mv "$TIME_TAKEN_BACKUP" "$TIME_TAKEN_ZSHRC"
    command rm -f "$minimal"
    echo "Could not install the minimal .zshrc; the original was restored." >&2
    return 1
  fi

  echo "Renamed $TIME_TAKEN_ZSHRC to $TIME_TAKEN_BACKUP."
  echo "Installed a minimal $TIME_TAKEN_ZSHRC containing only the benchmark commands."
  echo "Open a new terminal, then run time_taken or time_taken_info as often as needed."
  echo "Run time_taken_end when finished to restore the original .zshrc."
}

time_taken() {
  _time_taken_require_active || return 1

  time (source "$TIME_TAKEN_BACKUP")
}

time_taken_info() {
  _time_taken_require_active || return 1

  time (
    zmodload zsh/zprof || return 1
    zprof -c

    source "$TIME_TAKEN_BACKUP"
    local source_status=$?

    zprof
    return "$source_status"
  )
}

time_taken_end() {
  emulate -L zsh

  _time_taken_require_active || return 1

  if ! command mv "$TIME_TAKEN_BACKUP" "$TIME_TAKEN_ZSHRC"; then
    echo "Could not restore $TIME_TAKEN_ZSHRC." >&2
    return 1
  fi

  echo "Restored $TIME_TAKEN_ZSHRC."
  echo "Open a new terminal, or run: source $TIME_TAKEN_ZSHRC"
}
