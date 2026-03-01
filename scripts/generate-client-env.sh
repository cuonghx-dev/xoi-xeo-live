#!/bin/bash
# Generates client/.env from environment variables.
# Expects vars to already be exported by the calling script.
set -euo pipefail

OUTPUT="client/.env"

cat > "$OUTPUT" <<EOF
VITE_HLS_URL=http://${MEDIAMTX_IP_ADDRESS}:8888/${MEDIAMTX_PUBLISH_PATH}/index.m3u8
VITE_FOOTBALL_API_TOKEN=${FOOTBALL_API_TOKEN}
VITE_SERVER_URL=http://${MEDIAMTX_IP_ADDRESS}:4173
EOF

echo "Generated $OUTPUT"
