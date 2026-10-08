#!/usr/bin/env node
// Sincroniza a cópia derivada backend/data a partir da fonte canônica
// frontend/<setor>/<setor>.json, quando ela está disponível no contexto de
// execução. É executado automaticamente antes de `npm start` (hook prestart).
//
// Se a fonte canônica não existir (ex.: deploy cujo contexto inclui apenas o
// diretório backend/), mantém os arquivos já versionados em backend/data e
// encerra sem erro.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(BACKEND_DIR, '..');
const CANONICAL_DIR = path.join(REPO_ROOT, 'frontend');
const TARGET_DIR = path.join(BACKEND_DIR, 'data');

const SECTORS = [
  'communication-services',
  'consumer-discretionary',
  'consumer-staples',
  'energy',
  'financials',
  'health-care',
  'industrials',
  'information-technology',
  'materials',
  'real-estate',
  'utilities',
];

function main() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });

  let copied = 0;
  let missing = 0;

  for (const sector of SECTORS) {
    const source = path.join(CANONICAL_DIR, sector, `${sector}.json`);
    if (!fs.existsSync(source)) {
      missing += 1;
      continue;
    }
    fs.copyFileSync(source, path.join(TARGET_DIR, `${sector}.json`));
    copied += 1;
  }

  if (copied === 0) {
    console.log(
      '[sync-data] Fonte canônica indisponível; mantendo backend/data versionado.'
    );
    return;
  }

  console.log(`[sync-data] ${copied} setor(es) sincronizado(s) para backend/data.`);
  if (missing > 0) {
    console.log(`[sync-data] ${missing} setor(es) sem fonte canônica (mantidos como estão).`);
  }
}

main();
