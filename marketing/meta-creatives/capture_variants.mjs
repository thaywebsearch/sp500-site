// Renderiza os criativos Meta Ads nos formatos exigidos.
// Uso: node capture_variants.mjs
// Derivado de ../banner-metads/tools/capture.mjs (mesmo CDP headless, sem dependências).
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DEBUG_PORT = 9236;

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) throw new Error('Chrome/Edge não encontrado');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) || []) fn(msg.params);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }
}

async function withChrome(fn) {
  const userDataDir = mkdtempSync(join(tmpdir(), 'chrome-variants-'));
  const proc = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--hide-scrollbars',
      '--mute-audio',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  try {
    let target = null;
    for (let i = 0; i < 80 && !target; i++) {
      await sleep(250);
      try {
        const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
        target = list.find((t) => t.type === 'page');
      } catch {}
    }
    if (!target) throw new Error('Alvo DevTools do Chrome não encontrado');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });
    try {
      await fn(new CDP(ws));
    } finally {
      ws.close();
    }
  } finally {
    proc.kill();
  }
}

function waitForLoad(cdp) {
  return new Promise((resolve) => {
    const handler = () => {
      cdp.listeners.delete('Page.loadEventFired');
      resolve();
    };
    cdp.on('Page.loadEventFired', handler);
  });
}

async function evaluate(cdp, expression, awaitPromise = false) {
  const res = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (res.exceptionDetails) {
    throw new Error(res.exceptionDetails.exception?.description || 'Erro no evaluate');
  }
  return res.result?.value;
}

async function waitCondition(cdp, expression, timeoutMs = 15000, intervalMs = 400) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (await evaluate(cdp, expression)) return true;
    } catch {}
    await sleep(intervalMs);
  }
  return false;
}

async function screenshot(cdp, file, width, height, scale = 1) {
  const res = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width, height, scale },
  });
  writeFileSync(file, Buffer.from(res.data, 'base64'));
  return file;
}

async function fontsReady(cdp) {
  await evaluate(cdp, 'document.fonts.ready.then(() => true)', true);
  await sleep(300);
}

async function render(htmlFile, pngFile, width, height) {
  const url = 'file:///' + join(ROOT, htmlFile).replace(/\\/g, '/');
  await withChrome(async (cdp) => {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const loaded = waitForLoad(cdp);
    await cdp.send('Page.navigate', { url });
    await loaded;
    await fontsReady(cdp);
    await waitCondition(
      cdp,
      `document.querySelectorAll('img').length > 0 && [...document.images].every(i => i.complete)`,
      15000,
    );
    await sleep(600);
    await screenshot(cdp, join(ROOT, pngFile), width, height, 1);
    console.log('OK', pngFile);
  });
}

const FORMATS = [
  ['banner-1080x1350.html', 'banner-1080x1350.png', 1080, 1350],
  ['banner-1080x1920.html', 'banner-1080x1920.png', 1080, 1920],
  ['banner-1200x630.html', 'banner-1200x630.png', 1200, 630],
];

for (const [htmlFile, pngFile, w, h] of FORMATS) {
  await render(htmlFile, pngFile, w, h);
}
