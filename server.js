// Lindy Hop Library server: serves index.html and stores tutorials in a JSON file.
// No dependencies. Configure with environment variables:
//   PORT       port to listen on (default 3000)
//   DATA_DIR   folder for tutorials.json; mount a volume here (default ./data)
//   EDIT_KEY   if set, adding/editing/deleting tutorials needs this key
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const EDIT_KEY = process.env.EDIT_KEY || '';
const FILE = path.join(DATA_DIR, 'tutorials.json');
const SEED = path.join(__dirname, 'tutorials.json');
const PAGE = path.join(__dirname, 'index.html');
const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_BODY = 512 * 1024;

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(FILE)) {
  fs.copyFileSync(SEED, FILE);
  console.log('Seeded', FILE, 'from tutorials.json');
}

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch (e) { console.error('Could not read', FILE, e.message); return []; }
}
function save(list) {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}
function keyOk(req) {
  if (!EDIT_KEY) return true;
  const given = Buffer.from(String(req.headers['x-edit-key'] || ''));
  const want = Buffer.from(EDIT_KEY);
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}
function send(res, status, body, type) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (body === undefined) { res.writeHead(status, headers); return res.end(); }
  headers['Content-Type'] = type || 'application/json; charset=utf-8';
  res.writeHead(status, headers);
  res.end(type ? body : JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function clean(body) {
  const str = (v, n) => String(v == null ? '' : v).slice(0, n);
  const dirs = ['place', 'back', 'fwd', 'left', 'right', 'bl', 'br', 'fl', 'fr'];
  const foot = f => f && typeof f === 'object' ? {
    foot: f.foot === 'R' ? 'R' : 'L',
    dir: dirs.includes(f.dir) ? f.dir : 'place',
    turn: [0, 45, -45, 90, -90, 180].includes(Number(f.turn)) ? Number(f.turn) : 0,
  } : undefined;
  const steps = Array.isArray(body.steps) ? body.steps.slice(0, 64).map(s => {
    const o = { count: str(s.count, 3), leader: str(s.leader, 400), follower: str(s.follower, 400) };
    if (foot(s.lf)) o.lf = foot(s.lf);
    if (foot(s.ff)) o.ff = foot(s.ff);
    return o;
  }) : [];
  return {
    title: str(body.title, 80) || 'Untitled', category: str(body.category, 60), rhythm: str(body.rhythm, 20),
    position: str(body.position, 30), level: str(body.level, 20), summary: str(body.summary, 2000),
    tips: str(body.tips, 4000), video: /^https?:\/\//.test(body.video || '') ? str(body.video, 500) : '',
    steps, order: Number(body.order) || Date.now(), updated: Date.now(),
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      return send(res, 200, fs.readFileSync(PAGE), 'text/html; charset=utf-8');
    }
    if (req.method === 'GET' && p === '/api/health') return send(res, 200, { ok: true });
    if (req.method === 'GET' && p === '/api/config') return send(res, 200, { keyRequired: !!EDIT_KEY });
    if (req.method === 'GET' && p === '/api/tutorials') return send(res, 200, load());
    if (req.method === 'POST' && p === '/api/unlock') return keyOk(req) ? send(res, 204) : send(res, 401, { error: 'wrong key' });

    const m = p.match(/^\/api\/tutorials\/([^/]+)$/);
    if (m && (req.method === 'PUT' || req.method === 'DELETE')) {
      if (!keyOk(req)) return send(res, 401, { error: 'wrong key' });
      const id = decodeURIComponent(m[1]);
      if (!ID_RE.test(id)) return send(res, 400, { error: 'bad id' });
      const list = load().filter(t => t.id !== id);
      if (req.method === 'PUT') {
        const t = clean(await readBody(req));
        t.id = id;
        list.push(t);
      }
      save(list);
      return send(res, 204);
    }
    send(res, 404, { error: 'not found' });
  } catch (e) {
    console.error(req.method, p, e.message);
    send(res, 400, { error: 'bad request' });
  }
});

server.listen(PORT, () => console.log(`Lindy Hop Library on port ${PORT}, data in ${FILE}, edit key ${EDIT_KEY ? 'on' : 'off'}`));
