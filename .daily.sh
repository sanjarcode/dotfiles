#!/bin/bash
# ~/daily_tasks.sh

function upload_resume_to_naukri() {
    # open Chrome to the target page (will run your Tampermonkey script)
    RESUME_FOLDER="$HOME/.tampermonkey_dir"
    portkill 8085 && http-server -p 8085 --cors "$RESUME_FOLDER" &
    open -a "Google Chrome" "https://www.naukri.com/mnjuser/profile"
}
