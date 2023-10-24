#!/usr/bin/env sh

# y/n confirmation
# usage: `confirm "Show files" && ls`
## usage (with negatory hook), below
# confirm "Do you want to execute the generated command" || {
#     echo "No command run"
#     return
# }

## actual code
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
