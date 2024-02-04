#!/usr/bin/env bash

# CUSTOM Aliases #####################

#ls
alias l='ls -lah --color'
alias ls='ls --color'

# git
alias g='git'
alias gco="git checkout"
alias ga="git add"
alias gunadd="git restore --staged" # Unstage path1 path2...
alias gcan="git commit --amend --no-edit"
alias gcm="git commit -m"
alias gst="git status"

# gh - GitHub CLI
# get "commit" link instead of "tree" link.
alias ghcc='gh browse --no-browser $(git rev-parse HEAD) --repo $(git remote get-url origin | sed -e "s#.*github.com[:/]\(.*\)\.git#\1#") | tr -d "\n"'
# See: https://github.com/cli/cli/issues/7502
# Note: the --repo option is needed since `gh` doesn't work well when the repo is part of a fork chain
# the `git remote get-url` with `sed` is needed to get the value for `--repo`. `gh` doesn't have a way to get the repo name, yes, weird.
# the `git remote get-url` with `sed` works in all cases - cloned with git (SSH, HTTPS) or with `gh repo clone`

# flip, wait till it completes. Open notebook. Flip without waiting. Close the terminal window(Does not close the kernel).
alias pyflip='pyenv versions | grep "3" | xargs -I {} pyenv global {} > /dev/null 2>&1'

#alias jupyter-notebookk='pyenv versions | grep "3" | xargs -I {} pyenv global {} > /dev/null 2>&1 ;jupyter-notebook & pyenv versions | grep "3" | xargs -I {} pyenv global {} > /dev/null 2>&1'
alias jupyter-notebookk='pyenv versions | grep "3" | xargs -I {} pyenv global {} > /dev/null 2>&1 ;jupyter-notebook & pyenv versions | grep "3" | xargs -I {} pyenv global {} > /dev/null 2>&1 ; exit'

# for wiimote connection
alias wmote='wminput -c /etc/cwiid/wminput/gamepad'

#soft-reboot the computer
alias res='kill -9 -1'

#alias for youtube-dl all options
alias youtube-dl='youtube-dl -i --write-sub --write-auto-sub --sub-lang en --embed-subs'

# write stylus app
alias Write="/opt/not_installed/write300/Write/Write"

#alias for simple mysql interpreter
alias mysqli='mycli -u sanjarPractice -ppassword'

#alias for going incognito in the terminal
alias incogT="unset HISTFILE"

# for lifelogger
alias l="lifelogger"

# CUSTOM Functions #####################

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

# print random human-friendly name
function namegen {
    jsCode=$(cat <<-ENDJS
        const {
            uniqueNamesGenerator,
            adjectives,
            colors,
            animals
        } = require('unique-names-generator');

        const output = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: '-'
        });

        console.log(output);
ENDJS
)
    node -e "$jsCode"

    # npm package - https://www.npmjs.com/package/unique-names-generator#user-content-usage
    # multiline bash - "here document" (chatGPT) - https://chat.openai.com/chat/21ad89f6-231f-4f92-8256-52c0f652fdcb
    # node -e "some js code" option is available
}

function slow() {
    # default waiting time
    wait_time=0.5
    if [ "$1" -lt 5 ]; then
        wait_time="$1"
        return
    fi
    # if [ "$2" != '' ]; then
    #     $wait_time=$2
    # fi

    # do the work using awk
    "$@" | awk '{system("sleep '$wait_time'");print}'
}

function youtube-dl-numbered() {
    # runs the alias
    youtube-dl -cio "%(playlist_index)02d: %(title)s.%(ext)s" --write-sub --write-auto-sub --sub-lang en --embed-subs "$@"
}

function reposize() {
    # https://webapps.stackexchange.com/questions/39587/view-estimated-size-of-github-repository-before-cloning
    printf "$1" | perl -ne 'print $1 if m!([^/]+/[^/]+?)(?:\.git)?$!' | xargs -i curl -s -k https://api.github.com/repos/'{}' | grep size | tr -d -c 0-9 | awk '{printf $1/1024}'
    echo " MB"
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

# gitify prompt, taken from the Udacity Git course
function gitify_prompt() {
    red="\[\033[38;5;203m\]"
    green="\[\033[38;05;38m\]"
    blue="\[\033[0;34m\]"
    reset="\[\033[0m\]"

    export GIT_PS1_SHOWDIRTYSTATE=1

    # '\u' adds the name of the current user to the prompt
    # '\$(__git_ps1)' adds git-related stuff
    # '\W' adds the name of the current directory
    export PS1="$red\u$green\$(__git_ps1)$blue \W
$ $reset"

    # Changes colors for tty consoles
    if [ "$TERM" = "linux" ]; then
        echo -en "\e]P0232323" #black
        echo -en "\e]P82B2B2B" #darkgrey
        echo -en "\e]P1D75F5F" #darkred
        echo -en "\e]P9E33636" #red
        echo -en "\e]P287AF5F" #darkgreen
        echo -en "\e]PA98E34D" #green
        echo -en "\e]P3D7AF87" #brown
        echo -en "\e]PBFFD75F" #yellow
        echo -en "\e]P48787AF" #darkblue
        echo -en "\e]PC7373C9" #blue
        echo -en "\e]P5BD53A5" #darkmagenta
        echo -en "\e]PDD633B2" #magenta
        echo -en "\e]P65FAFAF" #darkcyan
        echo -en "\e]PE44C9C9" #cyan
        echo -en "\e]P7E5E5E5" #lightgrey
        echo -en "\e]PFFFFFFF" #white
        clear                  #for background artifacting
    fi
}

# To use the Heroku CLI's autocomplete --
#   Via homebrew's shell completion:
#     1) Follow homebrew's install instructions https://docs.brew.sh/Shell-Completion
#         NOTE: For zsh, as the instructions mention, be sure compinit is autoloaded
#               and called, either explicitly or via a framework like oh-my-zsh.
#     2) Then run
#       $ heroku autocomplete --refresh-cache
#   OR
#   Use our standalone setup:
#     1) Run and follow the install steps:
#       $ heroku autocomplete

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

# kill process at port
# Usage:
# `portkill 3000`
# `portkill 8301 8302` (multiple arguments supported)
function portkill() {
    for port in "$@"; do
        fuser -k "$port/tcp"
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
    ls -l "$MARKPATH" | sed 's/  / /g' | cut -d' ' -f9- | sed 's/ -/\t-/g' && echo
}
function getmark {
    echo $(realpath "$MARKPATH/$1") || echo "No such mark: $1"
}

_completemarks() {
  local curw=${COMP_WORDS[COMP_CWORD]}
  local wordlist=$(find $MARKPATH -type l -printf "%f\n")
  COMPREPLY=($(compgen -W '${wordlist[@]}' -- "$curw"))
  return 0
}

complete -F _completemarks jump unmark getmark

# make shorter aliases for these
alias jp="jump"
alias mk="mark"
alias um="unmark"
alias mks="marks"
alias gmk="getmark"

## bookmark setup END

# import function (run all top level files at path)
run_files_in_dir() {
    local directory="$1"

    if [ -d "$directory" ]; then
        for file in "$directory"/*.sh; do
            [ -e "$file" ] && source "$file"
        done
    else
        # commented out - remains silent
        # echo "Error: Directory not found - $directory"
        :
    fi
}

# safely add my scripts, for home-controller
run_files_in_dir ~/.my-scripts /dev/null 2>&1
$(startShutdownServerIdempotent > /dev/null 2>&1 &)
