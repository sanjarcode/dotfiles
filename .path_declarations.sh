#!/usr/bin/env sh

export PATH="$PATH:/opt/homebrew/bin/"
export PATH="$PATH:/opt/homebrew/lib/ruby/gems/3.0.0/bin"

## ================== Post install variables

if type pyenv &>/dev/null; then
    eval "$(pyenv init -)"
fi

if type rbenv &>/dev/null; then
    eval "$(rbenv init -)" # rbenv, added manually
fi

# Added after Rosetta 2 install

# alias rbrew='/usr/local/bin/brew'
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew' # To fix brew doctor's warning ""config" scripts exist outside your system or Homebrew directories" (https://github.com/pyenv/pyenv#:~:text=optional.%20to%20fix%20brew%20doctor's%20warning%20%22%22config)
# # Rosetta brew
# % which rbrew
alias rbrew="/usr/local/bin/brew"
# # Native brew
# % which brew
# /opt/homebrew/bin/brew
export PATH="/opt/homebrew/opt/libpq/bin:$PATH"

export PATH="/usr/local/bin:/usr/local/sbin:~/bin:$PATH" # for brew path $
# https://stackoverflow.com/q/12861422 --> https://stackoverflow.com/a/11$

export HOMEBREW_NO_AUTO_UPDATE=1 # disable auto update on each run of brew

# AndroidStudio \w React Native setup docs
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=~/Library/Android/sdk/tools:$PATH
export PATH=~/Library/Android/sdk/platform-tools:$PATH

# pnpm
export PNPM_HOME=$HOME/Library/pnpm
case ":$PATH:" in
*":$PNPM_HOME:"*) ;;
*) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"

export PATH="$HOME/.cargo/bin:$PATH" # for Rust

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# cocaopods
# export GEM_HOME=$HOME/.gem
# export PATH=$GEM_HOME/bin:$PATH

export PATH="$HOME/.cargo/bin:$PATH" # for Rust
# The following lines have been added by Docker Desktop to enable Docker CLI completions.
fpath=(/Users/sanjar/.docker/completions $fpath)
# autoload -Uz compinit
# compinit
# End of Docker CLI completions
export PATH="/opt/homebrew/bin:$PATH"
