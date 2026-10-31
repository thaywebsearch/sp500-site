// ========== STORE ÚNICO DE SETORES ==========
// Fonte de verdade no browser para /api/setores e /api/setor/:id.
//
// Problema que resolve: a home, o treemap, o heatmap e o fallback da
// inteligência setorial pediam os mesmos 11 JSONs (12 pedidos cada um).
// Aqui:
//   • uma Promise em curso é partilhada (dedupe de pedidos simultâneos);
//   • o resultado fica em cache durante a sessão (TTL curto, renovável);
//   • o refresh explícito é possível com { force: true }.
//
// Os formatos devolvidos são os que os componentes já esperavam: `dados`
// (payload cru de /api/setor/:id) e a lista agregada com `companies`.

import { API_BASE_URL, SECTORS } from './config.js';

// Os ficheiros de setor mudam no máximo a cada ~48 h; 15 min de cache evita
// pedidos repetidos sem esconder atualizações relevantes.
export const SECTOR_CACHE_TTL_MS = 15 * 60 * 1000;

let idsCache = null; // { ids, ts }
let idsEmCurso = null;

const setoresCache = new Map(); // id -> { dados, ts }
const setoresEmCurso = new Map(); // id -> Promise

export function getSectorName(id) {
  return SECTORS.find((s) => s.id === id)?.name || id;
}

async function pedirJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

function emCache(entrada) {
  return Boolean(entrada) && Date.now() - entrada.ts < SECTOR_CACHE_TTL_MS;
}

/** Lista de ids de setores (partilhada e cacheada). */
export function getSectorIds({ force = false } = {}) {
  if (!force && emCache(idsCache)) return Promise.resolve(idsCache.ids);
  if (!force && idsEmCurso) return idsEmCurso;

  const promessa = pedirJson(`${API_BASE_URL}/api/setores`).then((payload) => {
    const ids = Array.isArray(payload && payload.setores) ? payload.setores : [];
    idsCache = { ids, ts: Date.now() };
    return ids;
  });

  idsEmCurso = promessa;
  promessa
    .catch(() => {})
    .finally(() => {
      if (idsEmCurso === promessa) idsEmCurso = null;
    });

  return promessa;
}

/** Payload cru de um setor (`dados` de /api/setor/:id). */
export function getSectorPayload(id, { force = false } = {}) {
  const chave = String(id);

  if (!force && emCache(setoresCache.get(chave))) {
    return Promise.resolve(setoresCache.get(chave).dados);
  }
  if (!force && setoresEmCurso.has(chave)) {
    return setoresEmCurso.get(chave);
  }

  const promessa = pedirJson(`${API_BASE_URL}/api/setor/${encodeURIComponent(chave)}`).then(
    (payload) => {
      const dados = payload && payload.dados ? payload.dados : {};
      setoresCache.set(chave, { dados, ts: Date.now() });
      return dados;
    }
  );

  setoresEmCurso.set(chave, promessa);
  promessa
    .catch(() => {})
    .finally(() => {
      if (setoresEmCurso.get(chave) === promessa) setoresEmCurso.delete(chave);
    });

  return promessa;
}

/**
 * Lista agregada pronta para renderização.
 * Setores que falham devolvem `companies: []` em vez de rebentar a lista toda.
 */
export async function getAllSectors({ force = false } = {}) {
  const ids = await getSectorIds({ force });

  const resultados = await Promise.allSettled(ids.map((id) => getSectorPayload(id, { force })));

  return ids.map((id, i) => {
    const resultado = resultados[i];
    const dados = resultado.status === 'fulfilled' ? resultado.value : null;

    if (resultado.status === 'rejected') {
      console.error(`Erro ao carregar o setor ${id}:`, resultado.reason);
    }

    return {
      id,
      name: getSectorName(id),
      companies: Array.isArray(dados && dados.companies) ? dados.companies : [],
      generatedAt: (dados && dados.generatedAt) || null,
    };
  });
}

/** Limpa todo o cache (útil em testes e em refresh explícito global). */
export function resetSectorStore() {
  idsCache = null;
  idsEmCurso = null;
  setoresCache.clear();
  setoresEmCurso.clear();
}
