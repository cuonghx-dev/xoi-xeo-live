#!/bin/bash
# Generates server/.env from environment variables.
# Expects vars to already be exported by the calling script.
set -euo pipefail

OUTPUT="server/.env"

cat > "$OUTPUT" <<EOF
DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/xoixeo
JWT_SECRET=${JWT_SECRET}
PORT=4173
EOF

echo "Generated $OUTPUT"
