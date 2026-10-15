# Lindy Hop Library

A personal tutorial library for Lindy Hop moves: count-by-count steps for leader and follower, a tempo count player, and animated footprints.

## Files

- `index.html` – the page. On claude.ai it uses the artifact's database; anywhere else it talks to `server.js`.
- `server.js` – a small Node server (no dependencies) that serves the page and stores tutorials in `DATA_DIR/tutorials.json`.
- `tutorials.json` – the starting tutorials. Copied into the data folder on first start only; after that the data folder is the real copy.
- `Dockerfile` – builds the app image.

## Settings

| Variable   | Default     | Meaning |
|------------|-------------|---------|
| `PORT`     | `3000`      | Port inside the container |
| `DATA_DIR` | `/app/data` | Where tutorials are saved. Mount a volume here. |
| `EDIT_KEY` | (empty)     | If set, adding, editing and deleting tutorials needs this key. Viewing stays open. |

## Deploy on Dokploy

1. **Create the app.** In your project: *Create Service → Application*, name it `lindyhop`.
2. **Source.** Provider *GitHub*, repository `wonderch2021/lindyhop`, branch `main`. (Or provider *Git* with `https://github.com/wonderch2021/lindyhop.git` if the repo is public.)
3. **Build type.** *Dockerfile*, path `Dockerfile`.
4. **Environment.** Add `EDIT_KEY=<a long random string>`.
5. **Volume.** *Advanced → Volumes / Mounts*: add a *Volume mount*, name `lindyhop-data`, mount path `/app/data`. Without it, your tutorials are lost on every redeploy.
6. **Domain.** *Domains → Add domain*: your hostname (for example `lindy.yourdomain.ch`), container port `3000`. Point that hostname at Traefik in your Cloudflare Tunnel, like your other Dokploy apps.
7. **Deploy.** Click *Deploy*. Turn on *Autodeploy* to redeploy on every push to `main`.

## Run locally

```sh
EDIT_KEY=secret node server.js
# open http://localhost:3000
```

## Tutorial format

Each tutorial has `title`, `category`, `rhythm` (6-count / 8-count), `position`, `level`, `summary`, `tips` (one per line), `video`, and `steps`. Each step has a `count`, `leader` and `follower` text, and footprints in `lf` / `ff`: `{ "foot": "L"|"R", "dir": "place"|"back"|"fwd"|"left"|"right"|"bl"|"br"|"fl"|"fr", "turn": 0|±45|±90|180 }`.

## Backup

Your tutorials are one file: `/app/data/tutorials.json` in the container. Copy it out with
`docker cp <container>:/app/data/tutorials.json .`
