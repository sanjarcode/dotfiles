#!/usr/bin/env sh

## ================== sanjar aliases
if [ -f ~/.terminal_tool.sh ]; then
    source ~/.terminal_tool.sh
    source ~/.path_declarations.sh
    if [ ! -f ~/.env.sh ]; then
        echo "ENV variables not found" # for AI model files
        return 1
    fi
    source ~/.function_declarations.sh
    source ~/.invocations.sh
fi
