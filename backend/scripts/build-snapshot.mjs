#!/usr/bin/env node
// Gera o snapshot único consumido pelo dashboard.
//
// Fonte: backend/data/<setor>.json + backend/data/daily-summary.json
// Saída: backend/data/snapshot.json (não versionado; gerado no prestart/CI)
//
// O snapshot junta os 11 setores, o resumo do dia e metadados auditáveis:
//   schemaVersion, versao (hash estável do conteúdo), generatedAt,
//   referenceDate, totais e a lista de setores.
//
// `versao` depende apenas do conteúdo (setores + resumo), pelo que o mesmo
// conjunto de dados produz sempre o mesmo hash — mesmo que generatedAt mude.
//
// Uso:
//   node scripts/build-snapshot.mjs           # escreve snapshot.json
//   node scripts/build-snapshot.mjs --check   # valida sem escrever

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(BACKEND_DIR, 'data');

export const SNAPSHOT_SCHEMA_VERSION = 1;
export const MAX_REFERENCIA_DIAS_UTEIS = 2;

// Nomes de apresentação dos 11 setores GICS (espelho de config.js).
export const SETORES = [
  { id: 'communication-services', name: 'Communication Services' },
  { id: 'consumer-discretionary', name: 'Consumer Discretionary' },
  { id: 'consumer-staples', name: 'Consumer Staples' },
  { id: 'energy', name: 'Energy' },
  { id: 'financials', name: 'Financials' },
  { id: 'health-care', name: 'Health Care' },
  { id: 'industrials', name: 'Industrials' },
  { id: 'information-technology', name: 'Information Technology' },
  { id: 'materials', name: 'Materials' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'utilities', name: 'Utilities' },
];

// Campos mínimos por empresa (o esquema completo é validado pelos testes
// Python de integridade; aqui garantimos o contrato do snapshot).
const CAMPOS_EMPRESA = ['symbol', 'name', 'sector', 'marketCap', 'dividendYield', 'hasDividend'];
const MAX_YIELD_PERCENT = 25.0;

function lerJson(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

/** Hash estável do conteúdo relevante (setores + resumo), sem timestamps. */
function calcularVersao(setores, resumoDia) {
  const canonico = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    setores: setores.map((s) => ({
      id: s.id,
      name: s.name,
      count: s.count,
      companies: s.companies,
    })),
    resumoDia: resumoDia
      ? {
          referenceDate: resumoDia.referenceDate,
          stats: resumoDia.stats,
          marketMood: resumoDia.marketMood,
          topGainers: resumoDia.topGainers,
          topLosers: resumoDia.topLosers,
          sectorPerformance: resumoDia.sectorPerformance,
        }
      : null,
  };

  return crypto.createHash('sha256').update(JSON.stringify(canonico)).digest('hex').slice(0, 12);
}

function normalizarResumo(resumo) {
  if (!resumo || typeof resumo !== 'object') return null;
  return {
    generatedAt: resumo.generatedAt || null,
    referenceDate: resumo.referenceDate || null,
    stats: resumo.stats || {},
    marketMood: resumo.marketMood || null,
    topGainers: Array.isArray(resumo.topGainers) ? resumo.topGainers : [],
    topLosers: Array.isArray(resumo.topLosers) ? resumo.topLosers : [],
    sectorPerformance: Array.isArray(resumo.sectorPerformance) ? resumo.sectorPerformance : [],
  };
}

/**
 * Constrói o snapshot em memória.
 * @param {{dataDir?: string, agora?: Date}} opcoes
 */
export function construirSnapshot({ dataDir = DATA_DIR, agora = new Date() } = {}) {
  const setores = [];
  const simbolos = new Set();

  for (const { id, name } of SETORES) {
    const caminho = path.join(dataDir, `${id}.json`);
    if (!fs.existsSync(caminho)) {
      throw new Error(`Ficheiro de setor em falta: ${id}.json`);
    }

    const dados = lerJson(caminho);
    const companies = Array.isArray(dados.companies) ? dados.companies : [];

    if (companies.length === 0) {
      throw new Error(`Setor sem empresas: ${id}`);
    }

    for (const empresa of companies) {
      if (!empresa || typeof empresa.symbol !== 'string' || !empresa.symbol) {
        throw new Error(`Empresa sem símbolo no setor ${id}`);
      }
      if (simbolos.has(empresa.symbol)) {
        throw new Error(`Símbolo duplicado no snapshot: ${empresa.symbol}`);
      }
      simbolos.add(empresa.symbol);
    }

    setores.push({
      id,
      name,
      generatedAt: dados.generatedAt || null,
      liveUpdatedAt: dados.liveUpdatedAt || null,
      count: companies.length,
      companies,
    });
  }

  const caminhoResumo = path.join(dataDir, 'daily-summary.json');
  const resumoDia = fs.existsSync(caminhoResumo) ? normalizarResumo(lerJson(caminhoResumo)) : null;
  const versao = calcularVersao(setores, resumoDia);

  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    versao,
    generatedAt: agora.toISOString(),
    referenceDate: resumoDia?.referenceDate || null,
    resumoDia,
    setores,
    totais: {
      setores: setores.length,
      empresas: setores.reduce((total, s) => total + s.count, 0),
    },
    fontes: [
      'Yahoo Finance (não oficial)',
      'GitHub datasets/s-and-p-500-companies (PDDL-1.0)',
    ],
  };
}

function diasUteisEntre(referencia, hoje) {
  const inicio = new Date(`${referencia}T00:00:00Z`);
  const fim = new Date(
    Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), 0, 0, 0)
  );

  if (Number.isNaN(inicio.getTime())) return Infinity;
  if (inicio >= fim) return 0;

  let dias = 0;
  const cursor = new Date(inicio);
  while (cursor < fim) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const diaSemana = cursor.getUTCDay();
    if (diaSemana !== 0 && diaSemana !== 6) dias += 1;
  }
  return dias;
}

/**
 * Valida estrutura, hash e frescor do snapshot.
 * Devolve a lista de erros (vazia = válido).
 */
export function validarSnapshot(
  snapshot,
  { hoje = new Date(), maxDiasUteis = MAX_REFERENCIA_DIAS_UTEIS } = {}
) {
  const erros = [];

  if (!snapshot || typeof snapshot !== 'object') {
    return ['snapshot ausente ou inválido'];
  }
  if (snapshot.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    erros.push(`schemaVersion inesperado: ${snapshot.schemaVersion}`);
  }
  if (!Array.isArray(snapshot.setores) || snapshot.setores.length !== SETORES.length) {
    erros.push(`esperados ${SETORES.length} setores`);
  }

  const idsEsperados = new Set(SETORES.map((s) => s.id));
  const idsVistos = new Set();
  let totalEmpresas = 0;

  for (const setor of snapshot.setores || []) {
    if (!idsEsperados.has(setor.id)) erros.push(`setor desconhecido: ${setor.id}`);
    if (idsVistos.has(setor.id)) erros.push(`setor duplicado: ${setor.id}`);
    idsVistos.add(setor.id);

    if (!setor.name) erros.push(`setor ${setor.id} sem nome`);
    if (!Array.isArray(setor.companies) || setor.companies.length === 0) {
      erros.push(`setor ${setor.id} sem empresas`);
      continue;
    }
    if (setor.count !== setor.companies.length) {
      erros.push(`setor ${setor.id}: count não coincide com companies`);
    }

    totalEmpresas += setor.companies.length;
    const simbolos = new Set();

    for (const empresa of setor.companies) {
      for (const campo of CAMPOS_EMPRESA) {
        if (!(campo in empresa)) erros.push(`${setor.id}/${empresa.symbol || '?'}: falta ${campo}`);
      }
      if (!empresa.symbol || typeof empresa.symbol !== 'string') {
        erros.push(`setor ${setor.id}: empresa sem símbolo`);
        continue;
      }
      if (simbolos.has(empresa.symbol)) {
        erros.push(`setor ${setor.id}: símbolo duplicado ${empresa.symbol}`);
      }
      simbolos.add(empresa.symbol);

      const dy = empresa.dividendYield;
      if (dy !== null && dy !== undefined) {
        if (typeof dy !== 'number' || !Number.isFinite(dy) || dy <= 0) {
          erros.push(`${empresa.symbol}: dividendYield inválido (${dy})`);
        } else if (dy > MAX_YIELD_PERCENT) {
          erros.push(`${empresa.symbol}: dividendYield ${dy} acima de ${MAX_YIELD_PERCENT}%`);
        }
      }

      if (empresa.marketCap !== null && empresa.marketCap !== undefined) {
        if (
          typeof empresa.marketCap !== 'number' ||
          !Number.isFinite(empresa.marketCap) ||
          empresa.marketCap <= 0
        ) {
          erros.push(`${empresa.symbol}: marketCap inválido (${empresa.marketCap})`);
        }
      }
    }
  }

  for (const id of idsEsperados) {
    if (!idsVistos.has(id)) erros.push(`setor em falta: ${id}`);
  }

  if (snapshot.totais?.setores !== snapshot.setores?.length) {
    erros.push('totais.setores não coincide com a lista');
  }
  if (snapshot.totais?.empresas !== totalEmpresas) {
    erros.push('totais.empresas não coincide com as empresas');
  }

  const versaoEsperada = calcularVersao(snapshot.setores || [], snapshot.resumoDia || null);
  if (snapshot.versao !== versaoEsperada) {
    erros.push(`hash não coincide (esperado ${versaoEsperada})`);
  }

  if (!snapshot.referenceDate) {
    erros.push('referenceDate ausente');
  } else {
    const dias = diasUteisEntre(snapshot.referenceDate, hoje);
    if (dias > maxDiasUteis) {
      erros.push(
        `referenceDate ${snapshot.referenceDate} tem ${dias} dias úteis (máx. ${maxDiasUteis})`
      );
    }
  }

  return erros;
}

function escreverSnapshot(snapshot, destino = path.join(DATA_DIR, 'snapshot.json')) {
  fs.writeFileSync(destino, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  return destino;
}

const executadoDiretamente =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executadoDiretamente) {
  const apenasValidar = process.argv.includes('--check');
  const permitirDesatualizado = process.env.SNAPSHOT_ALLOW_STALE === '1';

  try {
    const snapshot = construirSnapshot();
    const erros = validarSnapshot(snapshot, {
      maxDiasUteis: permitirDesatualizado ? Number.POSITIVE_INFINITY : MAX_REFERENCIA_DIAS_UTEIS,
    });

    if (erros.length > 0) {
      console.error('[snapshot] Inválido:');
      for (const erro of erros) console.error(`  - ${erro}`);
      process.exitCode = 1;
    } else if (apenasValidar) {
      console.log(
        `[snapshot] Válido: ${snapshot.totais.setores} setores, ` +
          `${snapshot.totais.empresas} empresas, versão ${snapshot.versao}, ` +
          `referência ${snapshot.referenceDate}.`
      );
    } else {
      const destino = escreverSnapshot(snapshot);
      console.log(
        `[snapshot] Gerado ${path.relative(BACKEND_DIR, destino)}: ` +
          `${snapshot.totais.setores} setores, ${snapshot.totais.empresas} empresas, ` +
          `versão ${snapshot.versao}.`
      );
    }
  } catch (erro) {
    console.error(`[snapshot] Falha: ${erro.message}`);
    process.exitCode = 1;
  }
}
