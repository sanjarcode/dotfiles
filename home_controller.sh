#!/usr/bin/env sh

# placed at ~/.my-scripts
# Main commands: hc_setup, hc, hc_f, hc_l

# link: https://github.com/exemplar-codes/arduino-nodemcu-board-code/tree/c4b95283333af8876ec6b76a5306003b35e42d6c/nodemcu/POST_polling_relay_control_nodemcu

# discovers and prints result, or empty
_discover_url() {
    DEBUG_MODE="" # false
    # DEBUG_MODE="x" # true

    url=""
    for i in {0..9}; do
        url="http://192.168.0.10$i:4000"

        # curl $url -m 1 >/dev/null 2>&1
        # curl $url -m 1

        if [ -n "${DEBUG_MODE}" ]; then
            curl -w '\n' $url -m 1
        else
            curl -w '\n' $url -m 1 >/dev/null 2>&1
        fi

        if [ $? -eq 0 ]; then
            break
        fi

        if [ -n "${DEBUG_MODE}" ]; then
            echo "FAIL: $url"
            echo $?
            echo "---\n"
        fi
        url="" # clear value since it's invalid
    done

    echo $url
}

# discovers, stores url in file
hc_setup() {
    echo $(_discover_url) >~/.hc_url
    # echo "http://192.168.0.103:4000" >~/.hc_url
}

# get stored URL
hc_url() {
    cat ~/.hc_url
}

hc() {
    stored_url=$(hc_url)
    echo $stored_url
    curl -w '\n' $stored_url
}

hc_f() {
    url="$(hc_url)/toggle/0"
    echo $url
    curl -w '\n' $url
}

hc_l() {
    url="$(hc_url)/toggle/1"
    echo $url
    curl -w '\n' $url
}
