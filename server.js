// Lindy Hop Library server: serves index.html and the tutorials in tutorials.json (read-only).
// To add or change tutorials, edit tutorials.json in the repository and redeploy.
// No dependencies. PORT sets the port (default 3000).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PAGE = path.join(__dirname, 'index.html');
const TUTORIALS = path.join(__dirname, 'tutorials.json');

// index.html is written as page content (it also runs as a claude.ai artifact, which adds
// its own document shell), so wrap it in a full document with a mobile viewport here.
const HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<meta name="theme-color" content="#F4F3F7" media="(prefers-color-scheme: light)">' +
  '<meta name="theme-color" content="#14131B" media="(prefers-color-scheme: dark)">' +
  '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}' +
  'body{margin:0;font:14px system-ui,-apple-system,sans-serif;-webkit-text-size-adjust:100%}' +
  'img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
const FOOT = '</body></html>';

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(type ? body : JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const p = new URL(req.url, 'http://localhost').pathname;
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'read-only' });
    if (p === '/' || p === '/index.html') return send(res, 200, HEAD + fs.readFileSync(PAGE, 'utf8') + FOOT, 'text/html; charset=utf-8');
    if (p === '/api/health') return send(res, 200, { ok: true });
    if (p === '/api/tutorials') return send(res, 200, fs.readFileSync(TUTORIALS), 'application/json; charset=utf-8');
    send(res, 404, { error: 'not found' });
  } catch (e) {
    console.error(req.method, p, e.message);
    send(res, 500, { error: 'server error' });
  }
});

server.listen(PORT, () => console.log(`Lindy Hop Library on port ${PORT} (read-only)`));
