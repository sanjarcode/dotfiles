#!/usr/bin/env sh
cp ~/.dotfiles/.zshrc ~/.dotfiles/.terminal_tool.sh ~/.dotfiles/.path_declarations.sh ~/.dotfiles/.function_declarations.sh ~/.dotfiles/.invocations.sh ~
echo "\nDot files installed"
source  ~/.zshrc
dotfiles_check
echo "\nDot files initialized"

