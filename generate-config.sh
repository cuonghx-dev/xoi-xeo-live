#!/bin/bash
# Main config generator. Loads .env and runs all sub-scripts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: env file '$ENV_FILE' not found" >&2
  exit 1
fi

# Load and export all vars from env file
set -o allexport
# shellcheck disable=SC1090
source "$ENV_FILE"
set +o allexport

# Validate required variables
REQUIRED_VARS=(
  MEDIAMTX_PUBLISH_USER
  MEDIAMTX_PUBLISH_PASS
  MEDIAMTX_PUBLISH_PATH
  MEDIAMTX_IP_ADDRESS
  FOOTBALL_API_TOKEN
  POSTGRES_PASSWORD
  JWT_SECRET
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "Error: $var is not set in $ENV_FILE" >&2
    exit 1
  fi
done

# Run all generators
bash "$SCRIPT_DIR/scripts/generate-mediamtx-config.sh"
bash "$SCRIPT_DIR/scripts/generate-client-env.sh"
bash "$SCRIPT_DIR/scripts/generate-server-env.sh"
