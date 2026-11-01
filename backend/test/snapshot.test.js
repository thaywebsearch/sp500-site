import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_REFERENCIA_DIAS_UTEIS,
  SNAPSHOT_SCHEMA_VERSION,
  construirSnapshot,
  validarSnapshot,
} from '../scripts/build-snapshot.mjs';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(RAIZ, 'data');

/** Cópia temporária de backend/data para testes que alteram os dados. */
function copiarDados() {
  const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'sp500-snapshot-'));
  for (const ficheiro of fs.readdirSync(DATA_DIR)) {
    if (!ficheiro.endsWith('.json') || ficheiro === 'snapshot.json') continue;
    fs.copyFileSync(path.join(DATA_DIR, ficheiro), path.join(destino, ficheiro));
  }
  return destino;
}

function ler(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

function escrever(caminho, valor) {
  fs.writeFileSync(caminho, JSON.stringify(valor, null, 2));
}

/** Data (UTC) obtida somando dias a uma data ISO YYYY-MM-DD. */
function maisDias(dataIso, dias) {
  const data = new Date(`${dataIso}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dias);
  return data;
}

describe('construirSnapshot', () => {
  it('junta os 11 setores, o resumo e os totais', () => {
    const snapshot = construirSnapshot({ agora: new Date('2026-11-01T00:00:00Z') });

    assert.equal(snapshot.schemaVersion, SNAPSHOT_SCHEMA_VERSION);
    assert.equal(snapshot.setores.length, 11);
    assert.equal(snapshot.totais.setores, 11);
    assert.equal(snapshot.totais.empresas, 503);
    assert.match(snapshot.versao, /^[0-9a-f]{12}$/);
    assert.match(snapshot.referenceDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(snapshot.resumoDia);
    assert.equal(snapshot.generatedAt, '2026-11-01T00:00:00.000Z');

    for (const setor of snapshot.setores) {
      assert.ok(setor.id);
      assert.ok(setor.name);
      assert.equal(setor.count, setor.companies.length);
      assert.ok(setor.companies.length > 0);
    }
  });

  it('o hash não depende de generatedAt (mesmo conteúdo, mesma versão)', () => {
    const primeiro = construirSnapshot({ agora: new Date('2026-11-01T00:00:00Z') });
    const segundo = construirSnapshot({ agora: new Date('2026-11-02T12:34:56Z') });

    assert.equal(primeiro.versao, segundo.versao);
  });

  it('o hash ignora timestamps dos setores', () => {
    const dir = copiarDados();
    const antes = construirSnapshot({ dataDir: dir });

    const caminho = path.join(dir, 'energy.json');
    const dados = ler(caminho);
    dados.generatedAt = '2099-01-01';
    dados.liveUpdatedAt = '2099-01-01 00:00:00 +0000';
    escrever(caminho, dados);

    const depois = construirSnapshot({ dataDir: dir });

    assert.equal(depois.versao, antes.versao);
    assert.equal(depois.setores.find((s) => s.id === 'energy').generatedAt, '2099-01-01');
  });

  it('rejeita setor em falta', () => {
    const dir = copiarDados();
    fs.rmSync(path.join(dir, 'energy.json'));

    assert.throws(() => construirSnapshot({ dataDir: dir }), /energy\.json/);
  });

  it('rejeita símbolo duplicado', () => {
    const dir = copiarDados();
    const caminho = path.join(dir, 'energy.json');
    const dados = ler(caminho);
    dados.companies.push({ ...dados.companies[0] });
    escrever(caminho, dados);

    assert.throws(() => construirSnapshot({ dataDir: dir }), /Símbolo duplicado/);
  });
});

describe('validarSnapshot', () => {
  it('aceita o snapshot produzido a partir dos dados reais', () => {
    const snapshot = construirSnapshot();
    const erros = validarSnapshot(snapshot, {
      hoje: new Date(`${snapshot.referenceDate}T23:00:00Z`),
    });

    assert.deepEqual(erros, []);
  });

  it('deteta hash adulterado', () => {
    const snapshot = construirSnapshot();
    snapshot.versao = '000000000000';

    const erros = validarSnapshot(snapshot, {
      hoje: new Date(`${snapshot.referenceDate}T23:00:00Z`),
    });

    assert.ok(erros.some((erro) => erro.includes('hash não coincide')));
  });

  it('aplica o guard de yield máximo', () => {
    const dir = copiarDados();
    const caminho = path.join(dir, 'energy.json');
    const dados = ler(caminho);
    dados.companies[0].dividendYield = 25.5;
    escrever(caminho, dados);

    const snapshot = construirSnapshot({ dataDir: dir });
    const erros = validarSnapshot(snapshot, {
      hoje: new Date(`${snapshot.referenceDate}T23:00:00Z`),
    });

    assert.ok(erros.some((erro) => erro.includes('acima de 25%')));
  });

  it('deteta referenceDate fora do limite de dias úteis', () => {
    const snapshot = construirSnapshot();
    const limite = maisDias(snapshot.referenceDate, 30);

    const erros = validarSnapshot(snapshot, { hoje: limite });

    assert.ok(erros.some((erro) => erro.includes('dias úteis')));
    assert.equal(MAX_REFERENCIA_DIAS_UTEIS, 2);
  });

  it('rejeita setor em falta ou duplicado no snapshot', () => {
    const snapshot = construirSnapshot();
    snapshot.setores.pop();
    snapshot.totais.setores = snapshot.setores.length;

    const erros = validarSnapshot(snapshot, {
      hoje: new Date(`${snapshot.referenceDate}T23:00:00Z`),
    });

    assert.ok(erros.some((erro) => erro.includes('setor em falta')));
    assert.ok(erros.some((erro) => erro.includes('esperados 11 setores')));
  });
});
