# Lindy Hop Basics for Fellas

A personal tutorial library for Lindy Hop moves: count-by-count steps for leader and follower, a tempo count player, and animated footprints.

## Practice features

- **Count player sound** – click on every count (accents on count 1 and on rock steps, softer on the swung “&”), optional spoken counts, a spoken 5-6-7-8 lead-in, and optional music underneath.
- **Practice Room → Music & Tempo** – a swing groove (brushes, ride, walking bass, rhythm guitar) generated in the browser at any tempo, quick tempos 120–180, and tap tempo.
- **Practice Room → Combo Caller** – pick moves; the caller chains them by position (from `position`, e.g. `Open → Closed`) and says the next move just before it starts.
- **Practice Room → Practice Session** – timed blocks (drill a move, combo caller, free dance) with tempo changes, spoken transitions and ready-made plans. The plan is saved in the browser.
- **Videos** – 0.5× / 0.75× speed, −5 s and A–B looping under each video (YouTube and video files; Vimeo speed only where the video owner allows it).

Settings and the session plan live in the browser's local storage; the server stays read-only.

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

Each tutorial has `title`, `category`, `rhythm` (6-count / 8-count), `position`, `level`, `summary`, `tips` (one per line), `video` (one URL, or a list of URLs for several videos), and `steps`. Each step has a `count`, `leader` and `follower` text, and footprints in `lf` / `ff`: `{ "foot": "L"|"R", "dir": "place"|"back"|"fwd"|"left"|"right"|"bl"|"br"|"fl"|"fr", "turn": 0|±45|±90|180 }`.
