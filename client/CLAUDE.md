# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # Start dev server (0.0.0.0:5173 with HMR)
npm run build    # Type-check and build for production (tsc -b && vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

No test framework is configured.

## Architecture

This is a React 19 + TypeScript + Vite single-page application that serves as a WebRTC viewer for a live streaming setup.

**The entire app logic lives in `src/App.tsx`** — a single component that:
- Establishes a WebRTC `RTCPeerConnection` (receive-only: video + audio)
- Performs a WHEP (WebRTC-HTTP Egress Protocol) handshake by POSTing an SDP offer to `WHEP_URL`
- Renders a `<video>` element with connect/disconnect controls and a status badge

The `WHEP_URL` constant at the top of `App.tsx` points to the MediaMTX server's WHEP endpoint (`http://localhost:8889/live/stream/whep`). Update this when targeting a different environment.

## Infrastructure Context

This client is part of a broader streaming stack (defined in the parent directory `../`):

- **Local stack** (`docker-compose.local.yml`): Runs `acelink` (Acestream client on port 6878)
- **VPS stack** (`docker-compose.vps.yml`): Runs `mediamtx` (WebRTC/WHIP/WHEP on port 8889, ICE/UDP on 8189) and the `client` container (port 5173)

The streaming pipeline: Acestream → OBS (publishes via RTMP/WHIP to MediaMTX) → MediaMTX → this WHEP client.

MediaMTX config (`../mediamtx/config.yml`) uses `webrtcICEHostNAT1To1IPs: ["127.0.0.1"]` — update this with the actual server IP when deploying to a VPS.

## UI Stack

The client uses **shadcn/ui** with **Tailwind CSS v4** for a soccer-themed broadcast aesthetic:

- **Tailwind v4**: configured via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Theme variables live in `src/index.css` under `@theme`.
- **shadcn/ui**: initialized with `npx shadcn@latest init`. Config in `components.json`. Generated components live in `src/components/ui/` (ignored by ESLint — do not edit manually).
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).
- **Dark mode**: `class="dark"` is set on `<html>` in `index.html`. Dark theme colors are overridden in `src/index.css` (`.dark` block) to use soccer pitch greens.

To add more shadcn components: `npx shadcn@latest add <component>`

## Docker Dev

The `Dockerfile` runs the Vite dev server inside a Node 22 Alpine container with hot reload via a bind mount (defined in `docker-compose.vps.yml`). Port 5173 is exposed.
