import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
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

async function arrancarServidor() {
  const porta = await portaLivre();
  const env = { ...process.env, PORT: String(porta), CORS_ORIGINS: '' };
  const processo = spawn(process.execPath, [SERVIDOR], { cwd: RAIZ, env });
  const base = `http://127.0.0.1:${porta}`;

  for (let tentativa = 0; tentativa < 100; tentativa++) {
    try {
      const resposta = await fetch(`${base}/api/health`);
      if (resposta.ok) return { processo, base };
    } catch {
      // servidor ainda a arrancar
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  processo.kill();
  throw new Error('O servidor não arrancou dentro do tempo esperado');
}

describe('GET /api/inteligencia-setorial', () => {
  let servidor;
  let dados;

  before(async () => {
    servidor = await arrancarServidor();
    const resposta = await fetch(`${servidor.base}/api/inteligencia-setorial`);
    assert.equal(resposta.status, 200);
    const corpo = await resposta.json();
    assert.equal(corpo.sucesso, true);
    dados = corpo.dados;
  });

  after(() => {
    if (servidor && !servidor.processo.killed) servidor.processo.kill();
  });

  it('agrega os 11 setores e todas as empresas do índice', () => {
    assert.equal(dados.sectorCount, 11);
    assert.equal(dados.sectors.length, 11);
    assert.ok(dados.totalCompanies > 400);
    assert.ok(dados.totalMarketCap > 0);
  });

  it('ordena os setores por market cap e atribui ranking sequencial', () => {
    const caps = dados.sectors.map((s) => s.totalMarketCap);
    assert.deepEqual(caps, [...caps].sort((a, b) => b - a));
    assert.deepEqual(
      dados.sectors.map((s) => s.rank),
      Array.from({ length: dados.sectors.length }, (_, i) => i + 1)
    );
  });

  it('devolve métricas coerentes em cada setor', () => {
    const somaParticipacoes = dados.sectors.reduce((soma, s) => soma + s.marketCapShare, 0);

    assert.ok(Math.abs(somaParticipacoes - 1) < 0.01);
    assert.ok(dados.indexHhi > 0 && dados.indexHhi <= 10000);

    for (const setor of dados.sectors) {
      assert.ok(setor.id);
      assert.ok(setor.name);
      assert.ok(setor.companyCount > 0);
      assert.ok(setor.hhi >= 0 && setor.hhi <= 10000);
      assert.ok(['Alta', 'Moderada', 'Baixa'].includes(setor.concentration));
      assert.ok(['Renda', 'Equilibrado', 'Crescimento'].includes(setor.incomeProfile));
      assert.ok(setor.dividendCoverage >= 0 && setor.dividendCoverage <= 1);
      assert.ok(setor.topCompany && setor.topCompany.symbol);
      assert.ok(setor.topCompanies.length > 0);
      assert.ok(setor.topCompanies.length <= 5);
    }
  });

  it('destaca o maior setor em linha com o ranking', () => {
    assert.equal(dados.highlights.largestSector.id, dados.sectors[0].id);
    assert.equal(dados.highlights.largestSector.marketCap, dados.sectors[0].totalMarketCap);
    assert.ok(dados.highlights.mostConcentrated);
    assert.ok(dados.highlights.mostDiversified);
    assert.ok(dados.highlights.widestSector);
  });
});
