#!/bin/bash
# zcr = zoomcar restart — quit and reopen the app
zcr() {
  # Check if any Android emulator is connected
  if ! adb devices | grep -q "emulator.*device"; then
    echo "No emulator detected. Launching Medium_Phone..."
    emulator -avd Medium_Phone &
    # Wait for it to boot
    echo "Waiting for emulator to boot..."
    until adb shell getprop sys.boot_completed 2>/dev/null | grep -q "1"; do
      sleep 2
    done
    echo "Emulator booted."
  fi

  # -S stops the app before starting (cleaner than force-stop + separate start)
  # --activity-clear-task clears any existing task stack for a fresh launch
  adb shell am start -S --activity-clear-task \
    -n com.zoomcar.debug/com.zoomcar.splash.SplashActivity
}

# ZoomCar k8s — select and exec into a pod by namespace, service, and optional variant
# Usage:
#   kpod qa1 admin              # select from regular admin pods in qa1
#   kpod qa1 admin karafka      # select from admin-karafka pods
#   kpod prod webapp sidekiq    # select from webapp-sidekiq pods in prod
kpod() {
  local namespace="${1:?Usage: kpod <namespace> <service> [variant]}"
  local service="${2:?Usage: kpod <namespace> <service> [variant]}"
  local variant="$3"

  namespace=$(echo "$namespace" | tr '[:upper:]' '[:lower:]')
  service=$(echo "$service" | tr '[:upper:]' '[:lower:]')
  variant=$(echo "$variant" | tr '[:upper:]' '[:lower:]')

  local pods
  pods=$(kubectl get pods -n "$namespace" --no-headers 2>/dev/null | grep -iE "${service}")

  if [ -z "$pods" ]; then
    echo "No pods found for service '$service' in namespace '$namespace'" >&2
    return 1
  fi

  local filtered
  if [ -n "$variant" ]; then
    # Named variant: ns-svc-<variant>-<hash>-<hash>
    filtered=$(echo "$pods" | awk -v ns="$namespace" -v svc="$service" -v var="$variant" '
      $1 ~ "^" ns "-" svc "-" var "-" { print }
    ')
  else
    # Regular pods only: ns-svc-<hash>-<hash> (4 dash-separated segments)
    filtered=$(echo "$pods" | awk -v ns="$namespace" -v svc="$service" '
      $1 ~ "^" ns "-" svc "-[a-z0-9]+-[a-z0-9]+$" { print }
    ')
  fi

  if [ -z "$filtered" ]; then
    echo "No matching pods found" >&2
    return 1
  fi

  local selected
  selected=$(echo "$filtered" | fzf --height=15 --select-1 --prompt="Select pod > " | awk '{print $1}')

  if [ -z "$selected" ]; then
    echo "No pod selected" >&2
    return 1
  fi

  kubectl exec -it "$selected" -n "$namespace" -- /bin/sh
}

# ZoomCar k8s — tail logs from a pod by namespace, service, and optional variant
# Usage:
#   klog qa1 admin                    # tail logs (noise filtered)
#   klog qa1 admin karafka            # tail logs from a named variant
#   klog qa1 admin --verbose          # raw logs, no filtering
klog() {
  local verbose=false

  # --verbose must be the last argument (post option)
  if [ $# -gt 0 ] && [ "${@[-1]}" = "--verbose" ]; then
    verbose=true
  fi

  # Effective arg count without --verbose
  local argc=$#
  [ "$verbose" = true ] && argc=$(( argc - 1 ))

  if [ $argc -lt 2 ]; then
    echo "Usage: klog [--verbose] <namespace> <service> [variant]" >&2
    return 1
  fi

  local namespace="$1"
  local service="$2"
  local variant=""
  [ $argc -ge 3 ] && variant="$3"

  namespace=$(echo "$namespace" | tr '[:upper:]' '[:lower:]')
  service=$(echo "$service" | tr '[:upper:]' '[:lower:]')
  variant=$(echo "$variant" | tr '[:upper:]' '[:lower:]')

  local pods
  pods=$(kubectl get pods -n "$namespace" --no-headers 2>/dev/null | grep -iE "${service}")

  if [ -z "$pods" ]; then
    echo "No pods found for service '$service' in namespace '$namespace'" >&2
    return 1
  fi

  local filtered
  if [ -n "$variant" ]; then
    filtered=$(echo "$pods" | awk -v ns="$namespace" -v svc="$service" -v var="$variant" '
      $1 ~ "^" ns "-" svc "-" var "-" { print }
    ')
  else
    filtered=$(echo "$pods" | awk -v ns="$namespace" -v svc="$service" '
      $1 ~ "^" ns "-" svc "-[a-z0-9]+-[a-z0-9]+$" { print }
    ')
  fi

  if [ -z "$filtered" ]; then
    echo "No matching pods found" >&2
    return 1
  fi

  local selected
  selected=$(echo "$filtered" | fzf --height=15 --select-1 --prompt="Select pod > " | awk '{print $1}')

  if [ -z "$selected" ]; then
    echo "No pod selected" >&2
    return 1
  fi

  if [ "$verbose" = true ]; then
    kubectl logs -f "$selected" -n "$namespace"
  else
    kubectl logs -f "$selected" -n "$namespace" | awk '
      /\/health/ && /kube-probe/ { next }
      /\/status/ && /kube-probe/ { next }
      /invalid api_key/ || /\"\/status\"/ || /path=\/status/ || /GET \"\/status\"/ || /status request processing time/ { next }
      match($0, /\[[a-f0-9-]{36}\]/) {
        id = substr($0, RSTART+1, RLENGTH-2)
        if ($0 ~ /#status/) { exclude[id] = 1; next }
        if (id in exclude) next
      }
      { print }
    '
  fi
}

alias kauth="gcloud auth login"

jd() {
    # 1. Help message
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        echo "Jenkins Deployer (jd) CLI Helper"
        echo "==============================="
        echo "Usage (Interactive): jd"
        echo "Usage (Short Form):  jd <service> <environment> [--bundle]"
        echo "Usage (Long Form):   jd <service> <environment> <env_repeat> <branch> [--bundle]"
        echo ""
        echo "Services: api, admin, solomon, console"
        echo "Options:  --bundle (Sets REQUIRE_BUNDLE_INSTALL=true)"
        return 0
    fi

    # 2. Check for the Jenkins CLI jar dependency
    local JAR_PATH="$HOME/.dotfiles/companies/zoomcar/jenkins-cli.jar"
    if [ ! -f "$JAR_PATH" ]; then
        echo "Error: jenkins-cli.jar missing at $JAR_PATH" >&2
        echo "--------------------------------------------------------" >&2
        echo "To fix this:"
        echo "1. Log in to your Jenkins dashboard in the browser."
        echo "2. Head over to: https://nonprod-jenkins.zoomcartest.com/cli"
        echo "3. Download the 'jenkins-cli.jar' file."
        echo "4. Create the target directory and move it there:"
        echo "   mkdir -p ~/.dotfiles/companies/zoomcar/ && mv jenkins-cli.jar $JAR_PATH"
        echo "--------------------------------------------------------" >&2
        return 1
    fi

    # 3. Check if required environment variables are already active
    if [ -z "$ZOOMCAR_JENKINS_USERNAME" ] || [ -z "$ZOOMCAR_JENKINS_PASSWORD" ]; then
        echo "Error: ZOOMCAR_JENKINS_USERNAME or ZOOMCAR_JENKINS_PASSWORD is not set in your current environment." >&2
        return 1
    fi

    # Define menu options for the interactive mode
    local SERVICES="api\nadmin\nsolomon\nconsole"
    local ENVIRONMENTS="qa1\nqa2\nqa3\nstaging"
    local BRANCHES="qa1_staging\nqa2_staging\nqa3_staging\nmaster\ndevelop"

    local SERVICE_KEY="$1"
    local ENV="$2"
    local BRANCH=""
    local BUNDLE_ARG=""

    # 4. Interactive Mode (invoked if absolutely no arguments are passed)
    if [ -z "$SERVICE_KEY" ]; then
        if ! command -v fzf &> /dev/null; then
            echo "Error: 'fzf' is not installed. Provide arguments manually or install fzf." >&2
            echo "Usage: jd <service> <environment> [--bundle]" >&2
            return 1
        fi

        echo "--- Interactive Deployment Configurator ---"

        SERVICE_KEY=$(echo -e "$SERVICES" | fzf --prompt="Select Service > " --height=10% --layout=reverse)
        [ -z "$SERVICE_KEY" ] && { echo "Cancelled."; return 0; }

        ENV=$(echo -e "$ENVIRONMENTS" | fzf --prompt="Select Environment > " --height=10% --layout=reverse)
        [ -z "$ENV" ] && { echo "Cancelled."; return 0; }

        BRANCH=$(echo -e "$BRANCHES" | fzf --prompt="Select Branch > " --height=12% --layout=reverse)
        [ -z "$BRANCH" ] && { echo "Cancelled."; return 0; }

        local CHOSE_BUNDLE=$(echo -e "No\nYes" | fzf --prompt="Require Bundle Install? > " --height=8% --layout=reverse)
        if [[ "$CHOSE_BUNDLE" == "Yes" ]]; then
            BUNDLE_ARG="--bundle"
        fi
    else
        # 5. Route Positional Arguments Explicitly
        if [ -z "$ENV" ]; then
            echo "Error: Missing environment. Usage: jd <service> <environment> [--bundle]" >&2
            return 1
        fi

        if [ -z "$3" ]; then
            # E.g., jd api qa1
            BRANCH="${ENV}_staging"
        elif [[ "$3" == "--bundle" ]]; then
            # E.g., jd api qa1 --bundle
            BRANCH="${ENV}_staging"
            BUNDLE_ARG="--bundle"
        elif [ -n "$3" ] && [ -n "$4" ]; then
            # E.g., jd api qa1 qa1 qa1_staging
            # $3 is the repeated env name, $4 is the explicit branch target
            BRANCH="$4"
            BUNDLE_ARG="$5"
        else
            echo "Error: Invalid argument layout." >&2
            echo "Use 'jd api qa1', 'jd api qa1 --bundle', or 'jd api qa1 qa1 qa1_staging'" >&2
            return 1
        fi
    fi

    # 6. Map the service shortcut to the actual Jenkins Job Name
    local JOB_NAME=""
    case "$SERVICE_KEY" in
        api)     JOB_NAME="nonprd-cmn-api-CI" ;;
        admin)   JOB_NAME="nonprd-cmn-admin-CI" ;;
        solomon) JOB_NAME="nonprod-solomon-CI" ;;
        console) JOB_NAME="nonprd-cmn-api-console-CI" ;;
        *)
            echo "Error: Unknown service '$SERVICE_KEY'. Run 'jd --help' for options." >&2
            return 1
            ;;
    esac

    # 7. Parse the bundle option
    local BUNDLE_INSTALL="false"
    if [[ "$BUNDLE_ARG" == "--bundle" ]]; then
        BUNDLE_INSTALL="true"
    fi

    # 8. Execute Jenkins command
    echo ""
    echo "🚀 Triggering build for $JOB_NAME ($ENV / $BRANCH) [Bundle Install: $BUNDLE_INSTALL]..."
    echo ""

    if [[ $(command -v sdk) ]]; then
        sdk
    fi
    java -jar "$JAR_PATH" -s https://nonprod-jenkins.zoomcartest.com/ \
        -auth "${ZOOMCAR_JENKINS_USERNAME}:${ZOOMCAR_JENKINS_PASSWORD}" \
        build "$JOB_NAME" \
        -p ENVIRONMENT="$ENV" \
        -p BRANCH="$BRANCH" \
        -p REQUIRE_BUNDLE_INSTALL="$BUNDLE_INSTALL"
}
