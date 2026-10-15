# Lindy Hop Library

A personal tutorial library for Lindy Hop moves: count-by-count steps for leader and follower, a tempo count player, and animated footprints.

## Files

- `index.html` – the page (read-only: browse tutorials, count player, footprints).
- `server.js` – a small Node server (no dependencies) that serves the page and `tutorials.json`.
- `tutorials.json` – all tutorials. To add or change a move, edit this file and push; Dokploy redeploys.
- `Dockerfile` – builds the app image.

## Deploy on Dokploy

1. *Create Service → Application*, name `lindyhop`.
2. Source: GitHub repo `wonderch2021/lindyhop`, branch `main`.
3. Build type: *Dockerfile*.
4. Domain: your hostname, container port `3000`, HTTPS off when Cloudflare Tunnel handles TLS. Point the tunnel at Traefik (port 80).
5. Deploy, and turn on *Autodeploy* so every push to `main` redeploys.

No environment variables or volumes are needed.

## Run locally

```sh
node server.js
# open http://localhost:3000
```

## Tutorial format

Each tutorial has `title`, `category`, `rhythm` (6-count / 8-count), `position`, `level`, `summary`, `tips` (one per line), `video`, and `steps`. Each step has a `count`, `leader` and `follower` text, and footprints in `lf` / `ff`: `{ "foot": "L"|"R", "dir": "place"|"back"|"fwd"|"left"|"right"|"bl"|"br"|"fl"|"fr", "turn": 0|±45|±90|180 }`.
