#!/usr/bin/env sh
cp ~/.dotfiles/.zshrc ~/.dotfiles/.terminal_tool.sh ~/.dotfiles/.path_declarations.sh ~/.dotfiles/.function_declarations.sh ~/.dotfiles/.invocations.sh ~/.dotfiles/.zsh_boot.sh ~/.dotfiles/.env ~
echo "\nDot files installed"
source  ~/.zshrc
dot_status
echo "\nDot files initialized"

