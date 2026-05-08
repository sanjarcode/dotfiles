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
