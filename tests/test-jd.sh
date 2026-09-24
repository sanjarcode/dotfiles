#!/usr/bin/env bash
# Run with bash or zsh; Jenkins builds and browser opening are mocked.
source "$(dirname "$0")/../companies/zoomcar/zoomcar.sh"
export ZOOMCAR_JENKINS_USERNAME=test ZOOMCAR_JENKINS_PASSWORD=test
jobs='nonprd-cmn-api-CI
nonprd-cmn-api-console-CI
nonprd-cmn-admin-CI
nonprod-solomon-CI
gr-nonprd-cmn-zap-service-CI'
java() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            list-jobs) printf '%s\n' "$jobs"; return "${list_status:-0}" ;;
            build) shift; printf 'MOCK_BUILD %s\n' "$*"; return "${build_status_mock:-0}" ;;
        esac
        shift
    done
    return 1
}
open() { :; }
sdk() { :; }
fzf() {
    local choices
    choices=$(cat)
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
    result=$(jd "$@" 2>&1)
    rc=$?
    if [ "$rc" -ne "$expected_status" ] || [[ "$result" != *"$expected_text"* ]]; then
        printf 'FAIL: jd %s (exit %s)\n%s\n' "$*" "$rc" "$result"
        exit 1
    fi
    if [ "$expected_status" -ne 0 ] && [[ "$result" == *MOCK_BUILD* ]] && [ "${build_status_mock:-0}" -eq 0 ]; then
        echo 'FAIL: build triggered after resolution failure'
        exit 1
    fi
}
check 0 'MOCK_BUILD gr-nonprd-cmn-zap-service-CI -p ENVIRONMENT=qa2 -p BRANCH=qa2_staging -p REQUIRE_BUNDLE_INSTALL=false' zap-service qa2
check 0 'MOCK_BUILD nonprd-cmn-admin-CI' admin qa1
check 0 'MOCK_BUILD nonprod-solomon-CI' solomon qa1
check 0 'MOCK_BUILD nonprd-cmn-api-console-CI' console qa1
check 0 'MOCK_BUILD nonprd-cmn-api-CI' nonprd-cmn-api-CI qa1
check 0 'MOCK_BUILD nonprd-cmn-api-console-CI' api qa1
check 0 'Choose service or press Esc to quit.' api qa1
picker_status=130
check 1 'Cancelled.' api qa1
picker_status=0
check 1 'No Jenkins job matches' missing qa1
check 1 'No Jenkins job matches' '*' qa1
check 0 'BRANCH=feature/test -p REQUIRE_BUNDLE_INSTALL=true' zap-service qa2 qa2 feature/test --bundle
check 0 'REQUIRE_BUNDLE_INSTALL=true' zap-service qa2 --bundle --follow
list_status=1
check 1 'Unable to list Jenkins jobs' admin qa1
list_status=0
jobs=''
check 1 'No Jenkins job matches' admin qa1
jobs='gr-nonprd-cmn-zap-service-CI'
build_status_mock=7
check 7 'MOCK_BUILD gr-nonprd-cmn-zap-service-CI' zap-service qa1
echo 'PASS: jd resolution and build arguments'
