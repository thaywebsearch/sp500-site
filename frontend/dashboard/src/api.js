// ========== ACESSO À API COM CACHE ==========
import { API_BASE_URL, SECTORS } from './config.js';

let sectorsListPromise = null;
const sectorDataCache = new Map();
const sectorMetaCache = new Map();
const priceCache = new Map();
let dailySummaryPromise = null;
let dividendCalendarPromise = null;

export function fetchSectors() {
  if (!sectorsListPromise) {
    sectorsListPromise = (async () => {
      const res = await fetch(`${API_BASE_URL}/api/setores`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.setores || [];
    })();
  }
  return sectorsListPromise;
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

async function fetchSector(id) {
  if (sectorDataCache.has(id)) return sectorDataCache.get(id);
  try {
    const res = await fetch(`${API_BASE_URL}/api/setor/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const companies = data.dados?.companies || data.companies || [];
    sectorDataCache.set(id, companies);
    return companies;
  } catch (err) {
    console.error(`Erro ao buscar setor ${id}:`, err);
    return [];
  }
}

export function clearCache() {
  sectorsListPromise = null;
  sectorDataCache.clear();
  sectorMetaCache.clear();
  dailySummaryPromise = null;
  dividendCalendarPromise = null;
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

export function getDividendCalendar() {
  if (!dividendCalendarPromise) {
    dividendCalendarPromise = (async () => {
      const res = await fetch(`${API_BASE_URL}/api/calendario-dividendos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.dados || null;
    })();
  }
  return dividendCalendarPromise;
}
