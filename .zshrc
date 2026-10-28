#!/usr/bin/env sh

## ================== sanjar aliases
_dotfiles_config_dir="${${(%):-%N}:A:h}"

if [ -f "$_dotfiles_config_dir/.terminal_tool.sh" ]; then
    source "$_dotfiles_config_dir/.terminal_tool.sh"
    source "$_dotfiles_config_dir/.path_declarations.sh"
    if [ ! -f "$_dotfiles_config_dir/.env" ]; then
        echo "ENV variables not found" # for AI model files
        return 1
    else
        source "$_dotfiles_config_dir/.env"
    fi
    source "$_dotfiles_config_dir/.function_declarations.sh"
    source "$_dotfiles_config_dir/.invocations.sh"
    source ~/.dotfiles/companies/index.sh
fi

unset _dotfiles_config_dir
