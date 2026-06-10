#!/usr/bin/env sh

# git aliases
alias gst="git status"
alias ga="git add"
alias gcm="git commit -m"
alias gcan="git commit --amend --no-edit"
alias gunadd="git restore --staged" # Unstage path1 path2...
alias gpl="git pull"
alias gps="git push"
alias gls="git branch --sort=-committerdate" # git branch ls

function gplo() {
    # `git pull other` branch
    # for hands free other-than-current-branch-update, see https://stackoverflow.com/a/45622872
    # Assumption: remote and local branches have same name
    local_branch="$1"
    remote_branch="origin/$1"

    if [[ "$(git rev-parse --abbrev-ref $remote_branch)" == "origin/$local_branch" ]]; then
        git fetch -u origin "$local_branch":"$local_branch"
    else
        echo "Error: Remote branch '$remote_branch' doesn't match local branch '$local_branch'"
        echo "No action performed."
    fi
}

# Open a GitHub PR creation page using the current repo's origin remote
#
# Usage:
#   mkpr                    -> default base...current branch
#   mkpr main               -> main...current branch
#   mkpr main my-branch     -> main...my-branch
#
mkpr() {
  local default_base
  default_base=$(git config --local --get mkpr.baseBranch || echo "main")

  local default_compare
  default_compare=$(git config --local --get mkpr.compareBranch || git rev-parse --abbrev-ref HEAD)

  local base_branch="${1:-$default_base}"
  local compare_branch="${2:-$default_compare}"

  local remote_url
  remote_url=$(git remote get-url origin)

  remote_url="${remote_url#git@github.com:}"
  remote_url="${remote_url#https://github.com/}"
  remote_url="${remote_url%.git}"

  open "https://github.com/${remote_url}/compare/${base_branch}...${compare_branch}?expand=1"
}

# update current branch from upstream
function gup() {
  local default_base
  default_base=$(git config --local --get mkpr.baseBranch || echo "main")

  local base_branch="${1:-$default_base}"
  echo "Pulling latest $base_branch..."
  gplo "$base_branch"
  echo "Merging $base_branch into current branch..."
  git merge "$base_branch"
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
complete -F _gitstash_autocomplete mkpr
complete -F _gitstash_autocomplete gplo

# gh - GitHub CLI
# get "commit" link instead of "tree" link.
alias ghcc='gh browse --no-browser $(git rev-parse HEAD) --repo $(git remote get-url origin | sed -e "s#.*github.com[:/]\(.*\)\.git#\1#") | tr -d "\n"'
