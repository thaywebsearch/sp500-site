// Ferramenta de captura do banner Meta Ads (SP500-site).
// Usa o Chrome/Edge headless via CDP com built-ins do Node (sem dependências).
//
// Modos:
//   node capture.mjs app     -> captura vistas reais do dashboard para assets/
//   node capture.mjs banner  -> renderiza banner.html em PNG 1080x1080 + previews
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEBUG_PORT = 9223;
const ROOT = dirname(fileURLToPath(import.meta.url)); // .../marketing/banner-metads/tools
const BANNER_DIR = join(ROOT, '..');
const ASSETS = join(BANNER_DIR, 'assets');
mkdirSync(ASSETS, { recursive: true });

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
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
  const userDataDir = mkdtempSync(join(tmpdir(), 'chrome-banner-'));
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

async function waitCondition(cdp, expression, timeoutMs, intervalMs = 400) {
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

// ---------- modo app: captura das vistas reais ----------
async function captureApp() {
  await withChrome(async (cdp) => {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false,
    });
    const loaded = waitForLoad(cdp);
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await loaded;

    const ready =
      await waitCondition(
        cdp,
        `(() => {
          const rows = document.querySelectorAll('#table-body tr');
          const first = document.querySelector('#table-body tr td');
          const summary = document.querySelector('#daily-summary');
          return rows.length > 1 &&
            first && !/carregando/i.test(first.textContent) &&
            summary && summary.innerText.trim().length > 20;
        })()`,
        30000,
      );
    if (!ready) throw new Error('Dashboard não carregou dados a tempo');
    await fontsReady(cdp);
    await sleep(800);

    await screenshot(cdp, join(ASSETS, 'app-dashboard.png'), 1600, 1000, 2);
    console.log('OK app-dashboard.png');

    const tabs = [
      ['stock-of-day', 'app-stock-of-day'],
      ['treemap', 'app-treemap'],
      ['heatmap', 'app-heatmap'],
      ['bubble', 'app-bubble'],
    ];
    for (const [tab, name] of tabs) {
      await evaluate(cdp, `document.querySelector('[data-tab="${tab}"]')?.click()`);
      await sleep(2800); // tempo de renderização dos gráficos
      await screenshot(cdp, join(ASSETS, `${name}.png`), 1600, 1000, 2);
      console.log(`OK ${name}.png`);
      await evaluate(cdp, `document.querySelector('[data-tab="dashboard"]')?.click()`);
      await sleep(300);
    }
  });
}

// ---------- modo banner: renderização final ----------
async function captureBanner() {
  const bannerHtml = 'file:///' + join(BANNER_DIR, 'banner.html').replace(/\\/g, '/');
  await withChrome(async (cdp) => {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // 1) Final: 1080x1080 exatos
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1080,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    let loaded = waitForLoad(cdp);
    await cdp.send('Page.navigate', { url: bannerHtml });
    await loaded;
    await fontsReady(cdp);
    await waitCondition(cdp, `document.querySelectorAll('img').length > 0 && [...document.images].every(i => i.complete)`, 15000);
    await sleep(600);
    const finalPath = join(BANNER_DIR, 'banner-1080x1080.png');
    await screenshot(cdp, finalPath, 1080, 1080, 1);
    console.log('OK banner-1080x1080.png');

    // 2) Preview pequeno (simulação de ecrã de smartphone)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 324,
      height: 324,
      deviceScaleFactor: 2,
      mobile: true,
    });
    loaded = waitForLoad(cdp);
    await cdp.send('Page.navigate', { url: bannerHtml });
    await loaded;
    await fontsReady(cdp);
    await sleep(600);
    await screenshot(cdp, join(BANNER_DIR, 'preview-mobile.png'), 324, 324, 2);
    console.log('OK preview-mobile.png');
  });
}

// modo inspect: mede elementos do banner e captura regiões ampliadas
// uso: node capture.mjs inspect <x> <y> <w> <h> <scale> <outfile>
async function inspect(x, y, w, h, scale, outfile) {
  const bannerHtml = 'file:///' + join(BANNER_DIR, 'banner.html').replace(/\\/g, '/');
  await withChrome(async (cdp) => {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1080,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const loaded = waitForLoad(cdp);
    await cdp.send('Page.navigate', { url: bannerHtml });
    await loaded;
    await fontsReady(cdp);
    await sleep(600);
    const metrics = await evaluate(
      cdp,
      `(() => {
        const r = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: Math.round(b.top), left: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) };
        };
        return JSON.stringify({
          heroShot: r('.hero-shot'),
          heroImg: r('.hero-shot img'),
          cta: r('.cta'),
          headline: r('.headline'),
          features: r('.features'),
          fineprint: r('.fineprint'),
          brand: r('.brand'),
        });
      })()`,
    );
    console.log(metrics);
    await cdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x, y, width: w, height: h, scale },
    }).then((res) => {
      writeFileSync(outfile, Buffer.from(res.data, 'base64'));
      console.log(`OK ${outfile}`);
    });
  });
}

const mode = process.argv[2] || '';
if (mode === 'app') {
  await captureApp();
} else if (mode === 'banner') {
  await captureBanner();
} else if (mode === 'inspect') {
  const [, , , x, y, w, h, scale, outfile] = process.argv.map(Number);
  await inspect(process.argv[3] ? Number(process.argv[3]) : 0, Number(process.argv[4]) || 0, Number(process.argv[5]) || 1080, Number(process.argv[6]) || 1080, Number(process.argv[7]) || 2, process.argv[8] || join(ASSETS, 'inspect.png'));
} else {
  console.error('Uso: node capture.mjs <app|banner|inspect x y w h scale outfile>');
  process.exit(1);
}
