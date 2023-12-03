#!/usr/bin/env sh

# Note: The process takes ~1 minutes (best)

# Script level usage
### Requirements
## 1. Need an Expo account.
## 2. Install EAS CLI. Install using `npm install -g eas-cli`
## 3. Install project dependencies, `npm install`

# Running the script
## Step 1: Go to your expo project.
## Step 2: Run `build_apk` in the terminal.
## Step 3: Log in with Expo credentials if needed, and answer the prompts (or just press enter).
## Done!
## APK will be generated named `build-171something.apk`

build_apk() {
  build_aab
  aab_to_apk
}

## expo project to AAB
build_aab() {
  eas build --platform android --local
}

## AAB to APK
## Assumes defaults for input and output directory (same a project)
## provides device-spec.json file if not specified
## you don't need eas.json, it's generated automatically while generating AAB
aab_to_apk() {
  # Search for bundletool*.jar in ~/Downloads
  BUNDLETOOL_JAR=$(find ~/Downloads -name "bundletool*.jar" -type f -print -quit)

  # Default AAB path (latest AAB in current directory if not provided)
  AAB_PATH="${1:-$(find . -maxdepth 1 -type f -name "*.aab" -print -quit)}"

  # Default output directory (current directory if not provided)
  OUTPUT_DIR="${2:-.}"

  # Default device spec path (./device-spec.json if not provided)
  DEVICE_SPEC="${3:-}"

  # Default device spec content
  DEFAULT_DEVICE_SPEC='{
    "supportedAbis": ["arm64-v8a", "armeabi-v7a"],
    "screenDensity": 420,
    "sdkVersion": 28,
    "supportedLocales": ["en-US", "es-ES"]
  }'

  # Use default device spec if not provided
  if [ -z "$DEVICE_SPEC" ]; then
    DEVICE_SPEC="./device-spec.json"
    echo "$DEFAULT_DEVICE_SPEC" > "$DEVICE_SPEC"
  fi

  # Extract AAB file name without extension
  AAB_FILE_NAME=$(basename -- "$AAB_PATH")
  AAB_FILE_NAME="${AAB_FILE_NAME%.*}"

  # Check if all required arguments are provided
  if [ -z "$BUNDLETOOL_JAR" ] || [ -z "$AAB_PATH" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$DEVICE_SPEC" ]; then
    echo "Usage: build_apk [<path/to/app.aab>] [<path/to/output/directory>] [<path/to/device-spec.json>]"
    return 1
  fi

  # Build APKs using bundletool
  MODE="universal"
  java -jar "$BUNDLETOOL_JAR" build-apks --bundle="$AAB_PATH" --output="$OUTPUT_DIR/app.apks" --mode="$MODE"
  # Extract APK from APKS
  java -jar "$BUNDLETOOL_JAR" extract-apks --apks="$OUTPUT_DIR/app.apks" --output-dir="$OUTPUT_DIR" --device-spec="$DEVICE_SPEC"
  rm "$OUTPUT_DIR/app.apks" # avoid already exists error on next run

  ## Copy the first APK to the current directory
  generated_apk="$MODE.apk"

  cp "$generated_apk" "./$AAB_FILE_NAME.apk"
  rm "$OUTPUT_DIR/$generated_apk"

  echo "APK copied successfully: $AAB_FILE_NAME.apk"
}
