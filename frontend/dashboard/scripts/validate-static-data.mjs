#!/usr/bin/env node
// Valida os dados estáticos do dashboard (Dow, Kings, Aristocrats, Nasdaq-100).
//
// Cada ficheiro em src/data/*.json usa o envelope:
//   { schemaVersion, updatedAt, source, items }
//
// Executado em `pretest` (e manualmente com `npm run validate:data`).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');
const SCHEMA_VERSION = 1;
const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

const CAMPOS_TEXTO = ['company', 'ticker', 'sector'];

const DATASETS = [
  {
    ficheiro: 'dow-jones.json',
    nome: 'Dow Jones 30',
    total: 30,
    campos: CAMPOS_TEXTO,
  },
  {
    ficheiro: 'dividend-kings.json',
    nome: 'Dividend Kings',
    total: 38,
    campos: CAMPOS_TEXTO,
  },
  {
    ficheiro: 'dividend-aristocrats.json',
    nome: 'Dividend Aristocrats',
    total: 71,
    campos: [...CAMPOS_TEXTO, 'years'],
  },
  {
    ficheiro: 'nasdaq-100.json',
    nome: 'Nasdaq-100',
    total: 100,
    campos: [
      'rank',
      'ticker',
      'company',
      'sector',
      'weight',
      'cap',
      'category',
      'cumulative',
      'concentration',
    ],
  },
];

function lerJson(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

function validarTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function validarDataset(dataset) {
  const erros = [];
  const prefixo = dataset.ficheiro;
  const caminho = path.join(DATA_DIR, dataset.ficheiro);

  if (!fs.existsSync(caminho)) {
    return [`${prefixo}: ficheiro em falta`];
  }

  let dados;
  try {
    dados = lerJson(caminho);
  } catch (erro) {
    return [`${prefixo}: JSON inválido (${erro.message})`];
  }

  if (!dados || typeof dados !== 'object') return [`${prefixo}: conteúdo inválido`];
  if (dados.schemaVersion !== SCHEMA_VERSION) {
    erros.push(`${prefixo}: schemaVersion ${dados.schemaVersion} (esperado ${SCHEMA_VERSION})`);
  }
  if (!validarTexto(dados.source)) erros.push(`${prefixo}: source ausente`);
  if (!DATA_RE.test(String(dados.updatedAt || ''))) {
    erros.push(`${prefixo}: updatedAt inválido (${dados.updatedAt})`);
  }
  if (!Array.isArray(dados.items)) {
    erros.push(`${prefixo}: items não é uma lista`);
    return erros;
  }
  if (dados.items.length !== dataset.total) {
    erros.push(`${prefixo}: ${dados.items.length} itens (esperado ${dataset.total})`);
  }

  const tickers = new Set();
  dados.items.forEach((item, indice) => {
    const rotulo = `${prefixo}[${indice}]`;
    if (!item || typeof item !== 'object') {
      erros.push(`${rotulo}: item inválido`);
      return;
    }

    for (const campo of dataset.campos) {
      if (!(campo in item)) erros.push(`${rotulo}: falta ${campo}`);
    }

    for (const campo of CAMPOS_TEXTO) {
      if (campo in item && !validarTexto(item[campo])) {
        erros.push(`${rotulo}: ${campo} inválido`);
      }
    }

    if (validarTexto(item.ticker)) {
      if (tickers.has(item.ticker)) erros.push(`${rotulo}: ticker duplicado (${item.ticker})`);
      tickers.add(item.ticker);
    }
  });

  if (dataset.ficheiro === 'dividend-aristocrats.json') {
    dados.items.forEach((item, indice) => {
      if (!Number.isInteger(item.years) || item.years < 25) {
        erros.push(`${prefixo}[${indice}]: years inválido (${item.years})`);
      }
    });
  }

  if (dataset.ficheiro === 'nasdaq-100.json') {
    let acumulado = 0;
    dados.items.forEach((item, indice) => {
      if (item.rank !== indice + 1) {
        erros.push(`${prefixo}[${indice}]: rank ${item.rank} (esperado ${indice + 1})`);
      }
      if (!Number.isFinite(item.weight) || item.weight <= 0) {
        erros.push(`${prefixo}[${indice}]: weight inválido (${item.weight})`);
      }
      acumulado += Number(item.weight) || 0;
      if (!Number.isFinite(item.cumulative) || Math.abs(item.cumulative - acumulado) > 0.02) {
        erros.push(
          `${prefixo}[${indice}]: cumulative ${item.cumulative} != ${acumulado.toFixed(2)}`
        );
      }
      if (!Number.isFinite(item.cap) || item.cap <= 0) {
        erros.push(`${prefixo}[${indice}]: cap inválido (${item.cap})`);
      }
    });

    if (acumulado > 101 || acumulado < 95) {
      erros.push(`${prefixo}: soma dos pesos fora do intervalo (${acumulado.toFixed(2)}%)`);
    }
  }

  return erros;
}

const erros = DATASETS.flatMap(validarDataset);

if (erros.length > 0) {
  console.error('[dados-estáticos] Inválido:');
  for (const erro of erros) console.error(`  - ${erro}`);
  process.exitCode = 1;
} else {
  const totais = DATASETS.map((d) => `${d.nome}: ${d.total}`).join(', ');
  console.log(`[dados-estáticos] Válido (${totais}).`);
}
