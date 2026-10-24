#!/usr/bin/env sh

# Safe .env <-> .env.age workflow.
# .env is the editable plaintext source of truth and should be gitignored.
# .env.age is the encrypted artifact that can be committed.

# These names are initially aliases in .function_declarations.sh. Remove them
# before defining functions so zsh does not expand the alias names while parsing.
unalias encrypt_env 2>/dev/null || true
unalias decrypt_env 2>/dev/null || true

_env_age_require_age() {
  if command -v age >/dev/null 2>&1; then
    return 0
  fi

  echo "Error: 'age' is not installed." >&2
  if command -v brew >/dev/null 2>&1; then
    echo "Install it with: brew install age" >&2
  elif command -v apt >/dev/null 2>&1; then
    echo "Install it with: sudo apt install age" >&2
  else
    echo "Install age from: https://age-encryption.org" >&2
  fi
  return 1
}

_env_age_hash() {
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    echo "Error: no SHA-256 utility found (need shasum or sha256sum)." >&2
    return 1
  fi
}

_env_age_state_file() {
  local git_dir
  git_dir=$(git rev-parse --git-dir 2>/dev/null)
  if [ -n "$git_dir" ]; then
    printf '%s/env-age.state\n' "$git_dir"
  else
    printf '%s\n' ".env.age.state"
  fi
}

_env_age_write_state() {
  local state_file plain_hash cipher_hash
  state_file=$(_env_age_state_file) || return 1
  plain_hash=$(_env_age_hash .env) || return 1
  cipher_hash=$(_env_age_hash .env.age) || return 1
  printf '%s %s\n' "$plain_hash" "$cipher_hash" > "$state_file"
}

# Encrypt the latest .env into .env.age.
# Skips work when both plaintext and ciphertext still match the last successful run.
encrypt_env() {
  _env_age_require_age || return 1

  if [ ! -f .env ]; then
    echo "Error: .env not found. Nothing to encrypt." >&2
    return 1
  fi

  local state_file current_plain current_cipher previous_plain previous_cipher tmp
  state_file=$(_env_age_state_file) || return 1
  current_plain=$(_env_age_hash .env) || return 1
  current_cipher=""
  [ -f .env.age ] && current_cipher=$(_env_age_hash .env.age)

  if [ -f "$state_file" ]; then
    read -r previous_plain previous_cipher < "$state_file"

    if [ "$current_plain" = "$previous_plain" ] && [ -n "$current_cipher" ] && [ "$current_cipher" = "$previous_cipher" ]; then
      echo "No changes detected in .env; .env.age is already up to date."
      return 0
    fi

    if [ "$current_plain" != "$previous_plain" ]; then
      echo "Detected changes in .env. Encrypting the latest contents..."
    elif [ -n "$current_cipher" ] && [ "$current_cipher" != "$previous_cipher" ]; then
      echo ".env.age changed since the last local run. Re-encrypting current .env as the source of truth..."
    fi
  elif [ -f .env.age ]; then
    echo "No local encryption baseline found. Encrypting current .env as the source of truth..."
  else
    echo "Creating .env.age from current .env..."
  fi

  tmp=".env.age.tmp.$$"
  rm -f "$tmp"
  if ! age -p -o "$tmp" .env; then
    rm -f "$tmp"
    echo "Encryption failed; existing .env.age was left unchanged." >&2
    return 1
  fi

  mv "$tmp" .env.age
  _env_age_write_state || return 1
  echo "Encrypted latest .env -> .env.age."
  echo "Any detected .env changes are now included in .env.age."
}

# Decrypt .env.age into .env.
# Avoids overwriting a locally modified .env without confirmation.
decrypt_env() {
  _env_age_require_age || return 1

  if [ ! -f .env.age ]; then
    echo "Error: .env.age not found. Nothing to decrypt." >&2
    return 1
  fi

  local tmp decrypted_hash current_hash answer
  tmp=".env.tmp.$$"
  rm -f "$tmp"

  if ! age -d -o "$tmp" .env.age; then
    rm -f "$tmp"
    echo "Decryption failed; existing .env was left unchanged." >&2
    return 1
  fi

  if [ -f .env ]; then
    decrypted_hash=$(_env_age_hash "$tmp") || { rm -f "$tmp"; return 1; }
    current_hash=$(_env_age_hash .env) || { rm -f "$tmp"; return 1; }

    if [ "$decrypted_hash" = "$current_hash" ]; then
      rm -f "$tmp"
      _env_age_write_state || return 1
      echo ".env already matches .env.age; nothing changed."
      return 0
    fi

    echo "Warning: decrypted .env.age differs from your current .env."
    printf 'Overwrite local .env? [y/N] '
    read -r answer
    case "$answer" in
      y|Y|yes|YES) ;;
      *)
        rm -f "$tmp"
        echo "Cancelled; local .env was left unchanged."
        return 1
        ;;
    esac
  else
    echo "Creating .env from .env.age..."
  fi

  mv "$tmp" .env
  _env_age_write_state || return 1
  echo "Decrypted .env.age -> .env."
}
