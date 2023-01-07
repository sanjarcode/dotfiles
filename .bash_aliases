#!/usr/bin/env bash

# CUSTOM Aliases #####################

# git
alias gco="git checkout "
alias ga="git add "
alias gcan="git commit --amend --no-edit"
alias gcm="git commit -m "
alias gst="git status"

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

#alias for textshot - ianzhao, OCR copy
alias textshot="/opt/not_installed/textshot/textshot.py"

#alias for simple mysql interpreter
alias mysqli='mycli -u sanjarPractice -ppassword'

#alias for going incognito in the terminal
alias incogT="unset HISTFILE"

# for lifelogger
alias l="lifelogger"

# CUSTOM Functions #####################

function diskclear() {
    echo unfinished
    # snap list | awk '{print $1 " " $3}' | while read -r line; do
    #     # apprev=( $line )
    #     echo unfinished
    #     # revision=${line[1]}
    #     # echo "$app" "$revision"
    # done

    # ////
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

# function for downloading a file instantly using github
function gitt() {
    return
    #check if link is a GitHub link, if not do nothing
    # re='^(https://github.com/).*$'
    # if ! [[ "$1" =~ $re ]]; then
    #     echo "Invalid Link"
    #     return
    # fi

    # #check if we are home, we'll put in downloads
    # destination=$PWD
    # if [ "$destination" == $HOME ]; then
    #     destination="$PWD/Downloads/"
    # fi

    # #name of the file, same as /([^/].)*$
    # strin='https://github.com/po5/mpv_manager/blob/master/manager.lua'

    # repl1='//raw.githubusercontent'
    # strin=${strin//'//github'/$repl1}

    # repl2='/master/'
    # strin=${strin//'/blob/master/'/$repl2}

    # curl
}

function youtube-dl-numbered() {
    # runs the alias
    youtube-dl -cio "%(playlist_index)02d: %(title)s.%(ext)s" --write-sub --write-auto-sub --sub-lang en --embed-subs "$@"
}

#alias for restarting adb server and connecting to device
function adbc() {
    # adb="/home/sanjar/.AndroidSDK/Android/Sdk/platform-tools/adb"
    {
        mobile_ip_address="26.49.217.166"
        adb kill-server
        adb tcpip 5555
    } &>/dev/null
    if [[ $(adb connect "$mobile_ip_address") == *"connected to $mobile_ip_address"* ]]; then
        echo "Success"
    else
        echo "Failure"
    fi
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
function copyAndPaste() {
    if command -v xclip &> /dev/null
    then
        alias c="xclip -selection clipboard"
        alias v="xclip -o -selection clipboard"
        # echo "xclip exists"
        return
    fi

    # if command -v pbcopy &> /dev/null
    # then
    #     alias c="cat | pbcopy"
    #     alias p="pbpaste"
    #     # echo "pbcopy exists"
    #     return
    # fi
}