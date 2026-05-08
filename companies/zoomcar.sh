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
