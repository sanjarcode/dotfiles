#!/usr/bin/env sh

# shut down computer when pinged, if locked, from any home device
# intent: preserve monitor from overheating
# setup: add as computer startup script
# works on macos, linux
function startShutdownServer() {
    jump hc # home controller
    PORT=4001 node app.js
    cd -
}
