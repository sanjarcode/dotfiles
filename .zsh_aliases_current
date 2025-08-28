#!/usr/bin/env sh

# CUSTOM Aliases #####################

## https://apple.stackexchange.com/a/343629/458488
alias afk="osascript -e 'tell application \"System Events\" to keystroke \"q\" using {command down,control down}'"

alias ocr='/Applications/OwlOCR.app/Contents/MacOS/OwlOCR --cli '

# git
alias gcan="git commit --amend --no-edit"
alias gcm="git commit -m"
alias gls="git branch --sort=-committerdate" # git branch ls
function gplo() {
    # `git pull other` branch
    # for hands free other-than-current-branch-update, see https://stackoverflow.com/a/45622872
    # Assumption: remote and local branches have same name
    # Todo, figure out remote branch name even if different and pull, so command always succeeds
    # suppose you are on feat/xyz
    # gplo staging # will update the staging
    local_branch="$1"
    remote_branch="origin/$1"

    if [[ "$(git rev-parse --abbrev-ref $remote_branch)" == "origin/$local_branch" ]]; then
        # Perform the pull operation
        git fetch -u origin "$local_branch":"$local_branch"
    else
        echo "Error: Remote branch '$remote_branch' doesn't match local branch '$local_branch'"
        echo "No action performed."
    fi
}

function gsave() {
    git stash save $@
}
function gload() {
    git stash apply "stash^{/$@}"
}
_gitstash_autocomplete() {
    local cur
    cur="${COMP_WORDS[COMP_CWORD]}"
    COMPREPLY=( $(git stash list | sed -nE 's/stash@\{[0-9]+\}: (.*)/\1/p' | grep -i -- "$cur") )
}

complete -F _gitstash_autocomplete gload
complete -F _gitstash_autocomplete gsave

# gh - GitHub CLI
# get "commit" link instead of "tree" link.
alias ghcc='gh browse --no-browser $(git rev-parse HEAD) --repo $(git remote get-url origin | sed -e "s#.*github.com[:/]\(.*\)\.git#\1#") | tr -d "\n"'
# See: https://github.com/cli/cli/issues/7502
# Note: the --repo option is needed since `gh` doesn't work well when the repo is part of a fork chain
# the `git remote get-url` with `sed` is needed to get the value for `--repo`. `gh` doesn't have a way to get the repo name, yes, weird.
# the `git remote get-url` with `sed` works in all cases - cloned with git (SSH, HTTPS) or with `gh repo clone`

# CUSTOM Functions #####################

poweroff() {
  osascript -e 'tell app "System Events" to shut down'
}

# print (-s option) or navigate to Git repo root, current location or specified one
function groot {
    local show=
    local path=

    # Parse command line options
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -s)
                show=true
                shift
                ;;
            *)
                path="$1"
                shift
                ;;
        esac
    done

    # If no path is specified, use the current directory
    if [[ -z "$path" ]]; then
        path="."
    fi

    # Get the Git root directory and either change to it or print it
    local dir="$(cd "$path" && git rev-parse --show-toplevel 2>/dev/null)"
    if [[ -n "$dir" ]]; then
        dir="$(echo "$dir" | tr -d '\n')"
        if [[ -n "$show" ]]; then
            echo "$dir"
        else
            cd "$dir" || return
        fi
    else
        echo "Not inside a Git repository" >&2
        return 1
    fi
}

#advanced grep - works for images and pdfs too
function advgrep() {
    grep "$1" -ri -I # text files
    pdfgrep "$1" -ri # PDFs

    # images
    GRAY='\033[1;32m'
    NC='\033[0m' # No Color
    for file in $(find . -name '*.*g'); do
        tesseract "$file" stdout 2>/dev/null | grep "$1" -i && echo -e "${GRAY}$file${NC}\n"
    done
}

# CLI clipboard copy, paste
# Usage: `someCommand | c` copies the output to the clipboard
# Examples: `ls | c`, `cat someFile.txt | c`, `cat someFile.txt | grep 'hello' | c`
function copyAndPaste() {
    if command -v xclip &> /dev/null
    then
        alias c="xclip -selection clipboard"
        alias v="xclip -o -selection clipboard"
        # echo "xclip exists"
        return
    fi

    if command -v pbcopy &> /dev/null
    then
        alias c="cat | pbcopy"
        alias p="pbpaste"
        # echo "pbcopy exists"
        return
    fi
}

function setupEditorShortcut() {
    if command -v code &> /dev/null
    then
        alias edit="code"
        return
    fi

    if command -v cursor &> /dev/null
    then
        alias edit="cursor"
        return
    fi
}

# kill process at port
# Usage:
# `portkill 3000`
# `portkill 8301 8302` (multiple arguments supported)
portkill() {
    for port in "$@"; do
        pids=$(lsof -ti tcp:"$port")
        if [ -n "$pids" ]; then
            echo "Killing process using port $port"
            echo "$pids" | xargs kill
        else
            echo "No processes found using port $port."
        fi
    done
}

# print total number of lines in files at path and all descendants
function countLines() {
    find "$1" -type f -exec wc -l {} + | awk '{total += $1} END{print total}'
}

## bookmark setup for paths, START
## https://github.com/sanjar-notes/swe-culture-n-tools/issues/12
## source: https://jeroenjanssens.com/navigate/
export MARKPATH=$HOME/.marks
function jump {
    cd -P "$MARKPATH/$1" 2>/dev/null || echo "No such mark: $1"
}
function mark {
    mkdir -p "$MARKPATH"; ln -s "$(pwd)" "$MARKPATH/$1"
}
function unmark {
    rm -i "$MARKPATH/$1"
}
function marks {
    \ls -l "$MARKPATH" | tail -n +2 | sed 's/  / /g' | cut -d' ' -f9- | awk -F ' -> ' '{printf "%-10s -> %s\n", $1, $2}'
}
function getmark {
    echo $(realpath "$MARKPATH/$1") || echo "No such mark: $1"
}
function remark {
    unmark "$1"
    mark "$1"
}

function _completemarks {
  reply=($(ls $MARKPATH))
}

compctl -K _completemarks jump
compctl -K _completemarks unmark
compctl -K _completemarks remark
compctl -K _completemarks getmark

# make shorter aliases for these
alias jp="jump"
alias mk="mark"
alias um="unmark"
alias mks="marks"
alias gm="getmark"

## bookmark setup END

dot_file_setup () {
    brew install fzf zoxide pdfgrep ack
}

function nvms {
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
}
