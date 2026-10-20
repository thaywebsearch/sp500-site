import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVIDOR = path.join(RAIZ, 'server.js');

const ORIGEM_NETLIFY = 'https://sp500-dashboard.netlify.app';
const ORIGEM_PAGES = 'https://thaywebsearch.github.io';
const ORIGEM_NAO_AUTORIZADA = 'https://nao-autorizado.example';

/** Obtém uma porta TCP livre para cada servidor de teste. */
function portaLivre() {
  return new Promise((resolver, rejeitar) => {
    const s = net.createServer();
    s.on('error', rejeitar);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolver(port));
    });
  });
}

/**
 * Arranca o servidor com um ambiente controlado e devolve o processo + URL.
 * CORS_ORIGINS é sempre definido explicitamente (mesmo que vazio) para que o
 * ficheiro backend/.env local não influencie o resultado dos testes.
 */
async function arrancarServidor({ corsOrigins = '', corsOriginSingular } = {}) {
  const porta = await portaLivre();
  const env = { ...process.env, PORT: String(porta), CORS_ORIGINS: corsOrigins };
  delete env.CORS_ORIGIN;
  if (corsOriginSingular !== undefined) env.CORS_ORIGIN = corsOriginSingular;

  const processo = spawn(process.execPath, [SERVIDOR], { cwd: RAIZ, env });

  // Warnings vão para stderr e logs para stdout: junta tudo para as asserções.
  let saida = '';
  processo.stdout.on('data', (dados) => {
    saida += dados.toString();
  });
  processo.stderr.on('data', (dados) => {
    saida += dados.toString();
  });

  const base = `http://127.0.0.1:${porta}`;

  for (let tentativa = 0; tentativa < 100; tentativa++) {
    try {
      const resposta = await fetch(`${base}/api/health`);
      if (resposta.ok) return { processo, base, saida: () => saida };
    } catch {
      // servidor ainda a arrancar
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  processo.kill();
  throw new Error('O servidor não arrancou dentro do tempo esperado');
}

function parar(processo) {
  if (!processo.killed) processo.kill();
}

describe('CORS', () => {
  describe('com origens autorizadas', () => {
    let servidor;

    before(async () => {
      // Lista com 2 origens, espaço extra e barra final -> deve ser tolerado.
      servidor = await arrancarServidor({
        corsOrigins: `${ORIGEM_NETLIFY}, ${ORIGEM_PAGES}/`,
      });
    });

    after(() => parar(servidor.processo));

    it('responde ao preflight OPTIONS com 204 e Access-Control-Allow-Origin', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        method: 'OPTIONS',
        headers: {
          Origin: ORIGEM_NETLIFY,
          'Access-Control-Request-Method': 'GET',
        },
      });

      assert.equal(resposta.status, 204);
      assert.equal(resposta.headers.get('access-control-allow-origin'), ORIGEM_NETLIFY);
      assert.match(resposta.headers.get('access-control-allow-methods') || '', /GET/);
    });

    it('devolve Access-Control-Allow-Origin no GET', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        headers: { Origin: ORIGEM_NETLIFY },
      });

      assert.equal(resposta.status, 200);
      assert.equal(resposta.headers.get('access-control-allow-origin'), ORIGEM_NETLIFY);
    });

    it('aceita a segunda origem da lista (barra final tolerada)', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        headers: { Origin: ORIGEM_PAGES },
      });

      assert.equal(resposta.headers.get('access-control-allow-origin'), ORIGEM_PAGES);
    });

    it('aceita pedidos sem Origin (curl, health checks)', async () => {
      const resposta = await fetch(`${servidor.base}/api/health`);

      assert.equal(resposta.status, 200);
      assert.equal(resposta.headers.get('access-control-allow-origin'), null);
    });

    it('não devolve Access-Control-Allow-Origin para origem não autorizada', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        headers: { Origin: ORIGEM_NAO_AUTORIZADA },
      });

      assert.equal(resposta.headers.get('access-control-allow-origin'), null);
    });

    it('regista as origens permitidas no arranque', () => {
      assert.match(servidor.saida(), /\[CORS\] 2 origem\(ns\) permitida\(s\)/);
    });
  });

  describe('sem CORS_ORIGINS definido', () => {
    let servidor;

    before(async () => {
      servidor = await arrancarServidor({ corsOrigins: '' });
    });

    after(() => parar(servidor.processo));

    it('avisa de forma inequívoca no arranque', () => {
      assert.match(servidor.saida(), /\[WARN\] CORS_ORIGINS não definido ou vazio/);
      assert.match(servidor.saida(), /Ex\.: CORS_ORIGINS=https:\/\//);
    });

    it('mantém-se restritivo: nenhuma origem externa é aceite', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        headers: { Origin: ORIGEM_NETLIFY },
      });

      assert.equal(resposta.headers.get('access-control-allow-origin'), null);
    });
  });

  describe('com CORS_ORIGIN no singular', () => {
    let servidor;

    before(async () => {
      servidor = await arrancarServidor({
        corsOrigins: '',
        corsOriginSingular: ORIGEM_NETLIFY,
      });
    });

    after(() => parar(servidor.processo));

    it('avisa que o nome correto é CORS_ORIGINS (plural)', () => {
      assert.match(servidor.saida(), /CORS_ORIGIN \(singular\)/);
      assert.match(servidor.saida(), /Renomeie-a para CORS_ORIGINS/);
    });

    it('não trata CORS_ORIGIN como equivalente a CORS_ORIGINS', async () => {
      const resposta = await fetch(`${servidor.base}/api/setores`, {
        headers: { Origin: ORIGEM_NETLIFY },
      });

      assert.equal(resposta.headers.get('access-control-allow-origin'), null);
    });
  });
});
