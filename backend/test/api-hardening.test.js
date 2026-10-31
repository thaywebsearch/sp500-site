import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVIDOR = path.join(RAIZ, 'server.js');

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

/** Payload mínimo compatível com o formato chart do Yahoo. */
function payloadChart(closes) {
  const timestamps = closes.map((_, i) => 1700000000 + i * 86400);
  return {
    chart: {
      result: [
        {
          meta: { currency: 'USD' },
          timestamp: timestamps,
          indicators: {
            quote: [
              {
                open: closes,
                high: closes,
                low: closes,
                close: closes,
                volume: closes.map(() => 1000),
              },
            ],
          },
        },
      ],
      error: null,
    },
  };
}

/** Stub local do Yahoo: modo "ok", "erro" (500), "notfound" (404) ou "hang". */
async function arrancarYahooStub() {
  const estado = { modo: 'ok' };
  const servidor = http.createServer((req, res) => {
    if (estado.modo === 'hang') return; // nunca responde -> testa o timeout
    if (estado.modo === 'erro') {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('falha interna do stub');
    }
    if (estado.modo === 'notfound') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ chart: { result: null, error: 'Not Found' } }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payloadChart([100, 150])));
  });

  await new Promise((resolver) => servidor.listen(0, '127.0.0.1', resolver));
  const { port } = servidor.address();

  return {
    estado,
    url: `http://127.0.0.1:${port}`,
    fechar: () => new Promise((resolver) => servidor.close(resolver)),
  };
}

async function arrancarServidor(envExtra = {}) {
  const porta = await portaLivre();
  const env = {
    ...process.env,
    PORT: String(porta),
    CORS_ORIGINS: '',
    ...envExtra,
  };
  const processo = spawn(process.execPath, [SERVIDOR], { cwd: RAIZ, env });
  const base = `http://127.0.0.1:${porta}`;

  for (let tentativa = 0; tentativa < 100; tentativa++) {
    try {
      const resposta = await fetch(`${base}/api/health`);
      if (resposta.ok) {
        return {
          base,
          parar: () =>
            new Promise((resolver) => {
              processo.once('exit', resolver);
              processo.kill();
            }),
        };
      }
    } catch {
      // servidor ainda a arrancar
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  processo.kill();
  throw new Error('Servidor não arrancou a tempo');
}

describe('cache HTTP e hardening das rotas de setores', () => {
  let servidor;

  before(async () => {
    servidor = await arrancarServidor();
  });

  after(async () => {
    await servidor.parar();
  });

  it('/api/setores tem Cache-Control público e revalidável', async () => {
    const resposta = await fetch(`${servidor.base}/api/setores`);
    assert.equal(resposta.status, 200);
    const cache = resposta.headers.get('cache-control') || '';
    assert.match(cache, /public/);
    assert.match(cache, /max-age=300/);
    assert.match(cache, /stale-while-revalidate=86400/);

    const corpo = await resposta.json();
    assert.ok(Array.isArray(corpo.setores));
    assert.ok(corpo.setores.includes('energy'));
    assert.ok(!corpo.setores.includes('daily-summary'));
  });

  it('/api/setor/energy serve dados com cache público', async () => {
    const resposta = await fetch(`${servidor.base}/api/setor/energy`);
    assert.equal(resposta.status, 200);
    assert.match(resposta.headers.get('cache-control') || '', /max-age=300/);
    const corpo = await resposta.json();
    assert.equal(corpo.setor, 'energy');
    assert.ok(Array.isArray(corpo.dados.companies));
  });

  it('rejeita path traversal com 400 e sem cache', async () => {
    const tentativas = [
      '/api/setor/..%2f..%2fpackage',
      '/api/setor/%2e%2e%2f%2e%2e%2fpackage',
      '/api/setor/..%5c..%5cpackage',
      '/api/setor/ENERGY!',
    ];

    for (const rota of tentativas) {
      const resposta = await fetch(`${servidor.base}${rota}`);
      assert.equal(resposta.status, 400, `esperava 400 em ${rota}`);
      assert.match(resposta.headers.get('cache-control') || '', /no-store/);
      const corpo = await resposta.json();
      assert.equal(corpo.sucesso, false);
      assert.ok(!JSON.stringify(corpo).toLowerCase().includes('package'));
    }
  });

  it('devolve 404 JSON para setor válido mas inexistente', async () => {
    const resposta = await fetch(`${servidor.base}/api/setor/nao-existe`);
    assert.equal(resposta.status, 404);
    const corpo = await resposta.json();
    assert.equal(corpo.codigo, 'SETOR_NAO_ENCONTRADO');
    assert.ok(!JSON.stringify(corpo).includes(RAIZ));
  });

  it('/api/health não é cacheado e a rota 404 não expõe o caminho pedido', async () => {
    const health = await fetch(`${servidor.base}/api/health`);
    assert.match(health.headers.get('cache-control') || '', /no-store/);

    const inexistente = await fetch(`${servidor.base}/api/nao-existe`);
    assert.equal(inexistente.status, 404);
    const corpo = await inexistente.json();
    assert.equal(corpo.erro, 'Rota não encontrada');
    assert.equal(corpo.rota, undefined);
  });

  it('/api/cotacoes valida a lista de símbolos', async () => {
    const semSimbolos = await fetch(`${servidor.base}/api/cotacoes`);
    assert.equal(semSimbolos.status, 400);

    const invalidos = await fetch(`${servidor.base}/api/cotacoes?symbols=..%2fetc,AAPL`);
    assert.equal(invalidos.status, 400);

    const demasiados = await fetch(
      `${servidor.base}/api/cotacoes?symbols=${Array.from({ length: 26 }, (_, i) => `S${i}`).join(',')}`
    );
    assert.equal(demasiados.status, 400);
  });
});

describe('timeout, retry e degradação graciosa (Yahoo stub)', () => {
  let yahoo;
  let servidor;

  before(async () => {
    yahoo = await arrancarYahooStub();
    servidor = await arrancarServidor({
      YAHOO_BASE_URL: yahoo.url,
      YAHOO_TIMEOUT_MS: '250',
    });
  });

  after(async () => {
    await servidor.parar();
    await yahoo.fechar();
  });

  it('histórico válido devolve série com cache curto', async () => {
    yahoo.estado.modo = 'ok';
    const resposta = await fetch(`${servidor.base}/api/historico/AAPL`);
    assert.equal(resposta.status, 200);
    assert.match(resposta.headers.get('cache-control') || '', /max-age=120/);
    const corpo = await resposta.json();
    assert.deepEqual(
      corpo.registros.map((r) => r.close),
      [100, 150]
    );
  });

  it('timeout devolve 502 UPSTREAM_TIMEOUT sem detalhes internos', async () => {
    yahoo.estado.modo = 'hang';
    const inicio = Date.now();
    const resposta = await fetch(`${servidor.base}/api/historico/TIMEOUT`);
    const duracao = Date.now() - inicio;

    assert.equal(resposta.status, 502);
    assert.ok(duracao < 5000, `demorou ${duracao} ms`);
    const corpo = await resposta.json();
    assert.equal(corpo.codigo, 'UPSTREAM_TIMEOUT');
    assert.ok(!corpo.erro.includes('127.0.0.1'));
  });

  it('404 do Yahoo devolve SEM_DADOS', async () => {
    yahoo.estado.modo = 'notfound';
    const resposta = await fetch(`${servidor.base}/api/historico/ZZZZ`);
    assert.equal(resposta.status, 404);
    const corpo = await resposta.json();
    assert.equal(corpo.codigo, 'SEM_DADOS');
  });

  it('usa o último resultado bom quando a fonte falha', async () => {
    yahoo.estado.modo = 'ok';
    const primeira = await fetch(`${servidor.base}/api/historico/MSFT`);
    assert.equal(primeira.status, 200);

    yahoo.estado.modo = 'erro';
    const segunda = await fetch(`${servidor.base}/api/historico/MSFT`);
    assert.equal(segunda.status, 200);
    assert.match(segunda.headers.get('warning') || '', /110/);
    const corpo = await segunda.json();
    assert.equal(corpo.aviso, 'dados em cache local');
    assert.ok(Array.isArray(corpo.registros));
  });

  it('/api/cotacoes devolve preços em lote', async () => {
    yahoo.estado.modo = 'ok';
    const resposta = await fetch(`${servidor.base}/api/cotacoes?symbols=AAPL,MSFT`);
    assert.equal(resposta.status, 200);
    assert.match(resposta.headers.get('cache-control') || '', /max-age=60/);
    const corpo = await resposta.json();
    assert.equal(corpo.cotacoes.AAPL.preco, 150);
    assert.equal(corpo.cotacoes.MSFT.preco, 150);
  });
});
