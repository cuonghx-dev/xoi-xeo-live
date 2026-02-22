# Start

## Prerequisite

- Set up VPS stacks

```sh
  docker compose -f docker-compose.vps.yml -p vps up -d
```

## Start stream

- 1. Start Acestream client

```sh
  docker compose -f docker-compose.local.yml -p local up -d
```

- 2. Start OBS
- 3. Find the acestream links for events
- 4. Start Discord for mic join

<img width="1387" height="790" alt="image" src="https://github.com/user-attachments/assets/619fb113-8fc3-4ac8-8ce9-e286a95671e1" />
