#!/bin/bash
# Generates mediamtx/config.yml from environment variables.
# Expects vars to already be exported by the calling script.
set -euo pipefail

OUTPUT="mediamtx/config.yml"
mkdir -p mediamtx

cat > "$OUTPUT" <<EOF
webrtc: yes
webrtcAddress: :8889
webrtcICEHostNAT1To1IPs:
  - "${MEDIAMTX_IP_ADDRESS}"

webrtcICEUDPMuxAddress: :8189

webrtcICEServers2:
  - url: stun:stun.l.google.com:19302

authInternalUsers:
  - user: ${MEDIAMTX_PUBLISH_USER}
    pass: ${MEDIAMTX_PUBLISH_PASS}
    ips: []
    permissions:
      - action: publish
        path: ${MEDIAMTX_PUBLISH_PATH}
  - user: any
    pass:
    ips: []
    permissions:
      - action: read
        path: ${MEDIAMTX_PUBLISH_PATH}

paths:
  ${MEDIAMTX_PUBLISH_PATH}:
    source: publisher
EOF

echo "Generated $OUTPUT"
