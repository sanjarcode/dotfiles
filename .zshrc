export PATH="$PATH:/opt/homebrew/bin/"
export PATH="$PATH:/opt/homebrew/lib/ruby/gems/3.0.0/bin"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# enable global 3rd party modules import - added by me
# CommonJS syntax works, ESM gives error (partially)
if [ -n "$NVM_BIN" ]; then
    export NODE_PATH="${NVM_BIN/bin/lib/node_modules}"
    export PATH="$PATH:$NODE_PATH"
else
    ___MYNODEPATH=$(npm root -g 2> /dev/null)
    if [ -n "___MYNODEPATH" ]; then
        export NODE_PATH=$___MYNODEPATH
        export PATH="$PATH:$NODE_PATH"
    fi
fi

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.zsh_aliases, instead of adding them here directly.

if [ -f ~/.zsh_aliases ]; then
    . ~/.zsh_aliases
fi

#Added manually, during pyenv installation
if [ -f ~/.zprofile ]; then
    . ~/.zprofile
fi

# gitify_prompt()
eval "$(pyenv init -)"

#postgreSQL
export PATH="/Applications/Postgres.app/Contents/Versions/13/bin:$PATH"

custom_prompt

eval "$(rbenv init -)" # rbenv, added manually

if type brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH

    autoload -Uz compinit
fi

# Added after Rosetta 2 install

# alias rbrew='/usr/local/bin/brew'
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
