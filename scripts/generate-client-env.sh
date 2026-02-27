#!/bin/bash
# Generates client/.env from environment variables.
# Expects vars to already be exported by the calling script.
set -euo pipefail

OUTPUT="client/.env"

cat > "$OUTPUT" <<EOF
VITE_WHEP_URL=http://${MEDIAMTX_IP_ADDRESS}:8889/${MEDIAMTX_PUBLISH_PATH}/whep
VITE_FOOTBALL_API_TOKEN=${FOOTBALL_API_TOKEN}
VITE_SERVER_URL=http://${MEDIAMTX_IP_ADDRESS}:4173
EOF

echo "Generated $OUTPUT"
