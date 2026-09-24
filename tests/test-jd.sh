#!/usr/bin/env bash
# Run with bash or zsh; Jenkins builds and browser opening are mocked.
source "$(dirname "$0")/../companies/zoomcar/zoomcar.sh"
export ZOOMCAR_JENKINS_USERNAME=test ZOOMCAR_JENKINS_PASSWORD=test
jobs='nonprd-cmn-api-CI
nonprd-cmn-api-console-CI
nonprd-cmn-admin-CI
nonprod-solomon-CI
gr-nonprd-cmn-zap-service-CI'
curl() {
    [ "${list_status:-0}" -eq 0 ] || return "$list_status"
    if [ "${invalid_json:-0}" -eq 1 ]; then
        echo 'not JSON'
        return
    fi
    printf '%s\n' "$jobs" | jq -Rs '{jobs: (split("\n") | map(select(length > 0) | {name: ., disabled: false})) + [
        {name: "nonprd-cmn-api", disabled: true},
        {name: "disabled-zap-service", disabled: true},
        {name: "disabled-only", disabled: true},
        {name: "folder-without-status"}
    ]}'
}
java() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            build) shift; printf 'MOCK_BUILD %s\n' "$*"; return "${build_status_mock:-0}" ;;
        esac
        shift
    done
    return 1
}
open() { browser_opened=true; }
sdk() { :; }
fzf() {
    local choices
    choices=$(cat)
    if [ "$1" = '--prompt=Select Service > ' ]; then
        [ "$choices" = "$jobs" ] || { echo 'FAIL: interactive list includes disabled jobs' >&2; return 2; }
        echo 'nonprd-cmn-admin-CI'
        return
    fi
    case "$1" in
        '--prompt=Select Environment > ') echo qa1; return ;;
        '--prompt=Select Branch > ') echo qa1_staging; return ;;
        '--prompt=Require Bundle Install? > '|'--prompt=Follow build output? > ') echo No; return ;;
    esac
    if [ "$choices" != "$(printf '1.\tnonprd-cmn-api-CI\n2.\tnonprd-cmn-api-console-CI')" ]; then
        echo "FAIL: unexpected picker choices: $choices" >&2
        return 2
    fi
    [ "${picker_status:-0}" -eq 0 ] || return "$picker_status"
    printf '%s\n' "$choices" | sed -n '2p'
}
check() {
    local expected_status="$1" expected_text="$2" result rc
    shift 2
    result=$(
        browser_opened=false
        jd "$@" 2>&1
        rc=$?
        [ "$browser_opened" = false ] || echo MOCK_BROWSER_OPENED
        exit "$rc"
    )
    rc=$?
    if [ "$rc" -ne "$expected_status" ] || [[ "$result" != *"$expected_text"* ]]; then
        printf 'FAIL: jd %s (exit %s)\n%s\n' "$*" "$rc" "$result"
        exit 1
    fi
    if [ "$expected_status" -ne 0 ] && [[ "$result" == *MOCK_BUILD* ]] && [ "${build_status_mock:-0}" -eq 0 ]; then
        echo 'FAIL: build triggered after resolution failure'
        exit 1
    fi
    if { [ "$expected_status" -ne 0 ] && [[ "$result" == *MOCK_BROWSER_OPENED* ]]; } ||
       { [ "$expected_status" -eq 0 ] && [[ "$result" == *MOCK_BUILD* && "$result" != *MOCK_BROWSER_OPENED* ]]; }; then
        echo 'FAIL: browser should open only after a successful Jenkins command'
        exit 1
    fi
}
check 0 'MOCK_BUILD gr-nonprd-cmn-zap-service-CI -p ENVIRONMENT=qa2 -p BRANCH=qa2_staging -p REQUIRE_BUNDLE_INSTALL=false' zap-service qa2 qa2_staging
check 0 'MOCK_BUILD nonprd-cmn-admin-CI' admin qa1 qa1_staging
check 0 'MOCK_BUILD nonprd-cmn-admin-CI -p ENVIRONMENT=qa2 -p BRANCH=qa2_staging' admin-ci qa2 qa2_staging
check 0 'MOCK_BUILD nonprd-cmn-admin-CI' AdMiN-Ci qa2 qa2_staging
check 0 'Choose service or press Esc to quit.' API qa1 qa1_staging
check 0 'MOCK_BUILD nonprod-solomon-CI' solomon qa1 qa1_staging
check 0 'MOCK_BUILD nonprd-cmn-api-console-CI' console qa1 qa1_staging
check 0 'MOCK_BUILD nonprd-cmn-api-CI' nonprd-cmn-api-CI qa1 qa1_staging
check 0 'MOCK_BUILD nonprd-cmn-api-console-CI' api qa1 qa1_staging
check 0 'Choose service or press Esc to quit.' api qa1 qa1_staging
picker_status=130
check 1 'Cancelled.' api qa1 qa1_staging
picker_status=0
check 1 'No Jenkins job matches' missing qa1 qa1_staging
check 1 'No Jenkins job matches' '*' qa1 qa1_staging
check 1 'No Jenkins job matches' disabled-only qa1 qa1_staging
check 1 'No Jenkins job matches' folder-without-status qa1 qa1_staging
check 0 'MOCK_BUILD nonprd-cmn-admin-CI'
check 0 'BRANCH=feature/test -p REQUIRE_BUNDLE_INSTALL=true' zap-service qa2 feature/test --bundle
check 0 'REQUIRE_BUNDLE_INSTALL=true' zap-service qa2 qa2_staging --bundle --follow
check 0 'ENVIRONMENT=qa2 -p BRANCH=feature/test -p REQUIRE_BUNDLE_INSTALL=false' zap-service qa2 feature/test
check 0 'ENVIRONMENT=qa2 -p BRANCH=qa2 -p REQUIRE_BUNDLE_INSTALL=false' zap-service qa2 qa2
check 1 'Invalid argument layout' zap-service qa2
check 1 'Invalid argument layout' zap-service qa2 --bundle
check 1 'Invalid argument layout' zap-service qa2 qa2 qa2_staging
check 1 'Invalid argument layout' zap-service qa2 qa2_staging --unknown
check 1 'Invalid argument layout' zap-service qa2 ''
list_status=1
check 1 'Unable to list Jenkins jobs' admin qa1 qa1_staging
list_status=0
invalid_json=1
check 1 'Unable to read Jenkins job status' admin qa1 qa1_staging
invalid_json=0
jobs=''
check 1 'No Jenkins job matches' admin qa1 qa1_staging
jobs='gr-nonprd-cmn-zap-service-CI'
build_status_mock=7
check 7 'MOCK_BUILD gr-nonprd-cmn-zap-service-CI' zap-service qa1 qa1_staging
check 7 'MOCK_BUILD gr-nonprd-cmn-zap-service-CI' zap-service qa1 qa1_staging --follow
echo 'PASS: jd resolution and build arguments'
