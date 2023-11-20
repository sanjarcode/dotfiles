#!/usr/bin/env sh

# shut down computer when pinged, if locked, from any home device
# intent: preserve monitor from overheating
# setup: add as computer startup script
# works on macos, linux
function startShutdownServer() {
    hc_path=$(getmark hc)
    hc_script_path="$hc_path/app.js"
    PORT=4001 node $hc_script_path
}
