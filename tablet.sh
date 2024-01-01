#!/usr/bin/env sh

## Context: any-md is a directory with markdown files, I maintain on all devices
## It's bookmarked as any-md using the mark, getmark utility

TABLET_PATH="$(getmark any-md)/Excalidraw"
TABLET_FILE_NAME='drawing.excalidraw.md'
TABLET_PORT='4002'
TABLET_ADDRESS="http://192.168.0.101:$TABLET_PORT"

LAPTOP_PATH="$(getmark any-md)/Excalidraw"
LAPTOP_FILE_NAME='drawing.excalidraw.md'
# LAPTOP_PORT='4002'
# LAPTOP_ADDRESS="http://192.168.0.103:$LAPTOP_PORT"

FREQUENCY=5 # seconds

draw_laptop_sync_process() {
    while true; do
        curl -o "$TABLET_ADDRESS/$TABLET_FILE_NAME" "$LAPTOP_PATH/$LAPTOP_FILE_NAME"
        sleep "$FREQUENCY"
    done
}

draw_tablet_server() {
    # check if command 'http-server' exists
    if ! command -v http-server 2> /dev/null
    then
        echo "http-server could not be found"

        confirm "Install it?" || {
          echo "Not installed. Exiting."
          return
        }
    fi

    http-server "$TABLET_PATH" -p 8080
}
