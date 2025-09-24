#!/usr/bin/env sh

# Helps catch browser links to call
function setup_dialer() {
    node terminal-to-web-proxy &> /dev/null &
    adb start-server &> /dev/null &
}

setup_dialer
