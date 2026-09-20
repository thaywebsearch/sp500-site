// ========== ACESSO À API COM CACHE ==========
import { API_BASE_URL, SECTORS } from './config.js';

let sectorsListPromise = null;
const sectorDataCache = new Map();
const sectorMetaCache = new Map();
const priceCache = new Map();
let dailySummaryPromise = null;

function fetchSectors() {
  if (!sectorsListPromise) {
    sectorsListPromise = (async () => {
      const res = await fetch(`${API_BASE_URL}/api/setores`);
      if (!res.ok) throw new Error('Erro ao buscar setores');
      const data = await res.json();
      return data.setores || [];
    })();
  }
  return sectorsListPromise;
}

function fetchSector(id) {
  if (!sectorDataCache.has(id)) {
    sectorDataCache.set(
      id,
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/setor/${id}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const d = await res.json();
          const companies = Array.isArray(d.dados?.companies) ? d.dados.companies : [];
          const sectorName = SECTORS.find((s) => s.id === id)?.name || id;
          sectorMetaCache.set(id, {
            lastUpdated: d.dados?.liveUpdatedAt || d.dados?.generatedAt || null,
          });
          return companies.map((c) => ({ ...c, sector: id, sectorName }));
        } catch (error) {
          console.error(`Erro ao carregar ${id}:`, error);
          return [];
        }
      })()
    );
  }
  return sectorDataCache.get(id);
}

export async function getAllSectorData() {
  const setores = await fetchSectors();
  const entries = await Promise.all(
    setores.map(async (id) => {
      const companies = await fetchSector(id);
      const sectorName = SECTORS.find((s) => s.id === id)?.name || id;
      return {
        id,
        name: sectorName,
        companies,
        lastUpdated: sectorMetaCache.get(id)?.lastUpdated ?? null,
      };
    })
  );
  return entries;
}

export function clearCache() {
  sectorsListPromise = null;
  sectorDataCache.clear();
  sectorMetaCache.clear();
  dailySummaryPromise = null;
}

export function getPriceHistory(symbol) {
  if (!priceCache.has(symbol)) {
    priceCache.set(
      symbol,
      (async () => {
        const res = await fetch(`${API_BASE_URL}/api/historico/${encodeURIComponent(symbol)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.registros || [];
      })()
    );
  }
  return priceCache.get(symbol);
}

export function getDailySummary() {
  if (!dailySummaryPromise) {
    dailySummaryPromise = (async () => {
      const res = await fetch(`${API_BASE_URL}/api/resumo-dia`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.dados || null;
    })();
  }
  return dailySummaryPromise;
}
