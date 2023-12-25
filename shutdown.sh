#!/usr/bin/env sh

PORT=4001

# shut down computer when pinged, if locked, from any home device
# intent: preserve monitor from overheating
# setup: add as computer startup script
# works on macos, linux
function startShutdownServer() {
    hc_path=$(getmark hc)
    hc_script_path="$hc_path/app.js"
    PORT="${PORT}" node $hc_script_path
}

function getProblematicPids() {
    # hcpid=$(lsof -i -P -n | grep 4001 | awk '{print $2}')
    # not needed, background jobs cannot affect shutdown
    PROMPT_EOL_MARK='' # removes zsh's stupid EOL
    pgrep -i -a 'iterm|qemu' | tr '\n' ' '
}

function startShutdownServerIdempotent() {
    # Check if localhost:4001 is reachable
    isServerRunning=$(curl -sSf "http://localhost:${PORT}" > /dev/null 2>&1)
    if [ $? != 0 ]; then
        startShutdownServer > /dev/null 2>&1 &
    else
        # Echo a message indicating the server is already running
        echo "Server already running on localhost:${PORT}"
    fi
}

# Add to .zshrc
# $(startShutdownServerIdempotent > /dev/null 2>&1 &)
