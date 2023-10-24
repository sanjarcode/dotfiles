#!/usr/bin/env sh

# y/n confirmation
# usage: `confirm "Show files" && ls`
confirm() {
    local prompt="$1"
    local response

    # Prompt the user until a valid response is received
    while true; do
        echo -n "$prompt (y/n): "
        read response
        case "$response" in
        [yY][eE][sS] | [yY])
            return 0 # Success
            ;;
        [nN][oO] | [nN])
            return 1 # Error
            ;;
        *)
            echo "Please answer 'yes' or 'no'."
            ;;
        esac
    done
}

# Example usage:
# `aido "print hello"`
# this will show a command to be run in the terminal, and prompt the user to confirm

## Realistic example (below)
# aido "show non-hidden files greater than 1kb in current folder"
# Generated Command: ls -l | grep -v "^d" | awk '$5 > 1'
# Do you want to execute the generated command (y/n): y
# -rw-r--r--@ 1 muhammad  staff  1338 Oct 15 18:56 home-controller.sh
# -rw-r--r--@ 1 muhammad  staff  1372 Oct 24 19:54 llm_stuff.sh
# -rw-r--r--@ 1 muhammad  staff   507 Oct 24 19:44 utils.sh

## `llm` set up: https://github.com/simonw/llm#installation
aido() {
    # Check if a command is provided
    if [ -z "$1" ]; then
        echo "Usage: aido <command>"
        return
    fi

    # Create a template for the llm command with proper escaping
    template="write a command to $1, in current folder on linux. Only write the command/code, no explanation is needed"

    # Use the `llm` command to get the language model response using the template
    llm_response=$(llm "$template")

    # Print the generated command from the language model
    echo "Generated Command: $llm_response"

    # Prompt the user if they want to execute the generated command
    confirm "Do you want to execute the generated command" || {
        echo "No command run"
        return
    }

    # Execute the generated command
    eval "$llm_response"
}
