# Lindy Hop Library

A personal tutorial library for Lindy Hop moves: count-by-count steps for leader and follower, a tempo count player, and animated footprints.

- `index.html` – the page. It is built to run as a claude.ai artifact, where tutorials are stored in the artifact's database. Opened outside claude.ai it shows "Library not available".
- `tutorials.json` – an export of the tutorials (closed basic, send out, open basic, bring in, underarm pass), including footprint data per count.

## Tutorial format

Each tutorial has `title`, `category`, `rhythm` (6-count / 8-count), `position`, `level`, `summary`, `tips` (one per line), `video`, and `steps`. Each step has a `count`, `leader` and `follower` text, and footprints in `lf` / `ff`: `{ "foot": "L"|"R", "dir": "place"|"back"|"fwd"|"left"|"right"|"bl"|"br"|"fl"|"fr", "turn": 0|±45|±90|180 }`.
