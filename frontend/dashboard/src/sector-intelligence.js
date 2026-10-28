// ========== INTELIGÊNCIA SETORIAL GICS ==========
// Agrega os setores do S&P 500 em métricas comparáveis (tamanho, concentração,
// amplitude e perfil de dividendos). A API expõe o cálculo em
// GET /api/inteligencia-setorial; as funções puras abaixo permitem recalcular
// no browser (fallback) e são testadas isoladamente.

import { API_BASE_URL, SECTORS } from './config.js';
import { getSectorIntelligence } from './api.js';
import { escapeHtml, formatMarketCap } from './utils.js';

export const HHI_ALTA = 2500;
export const HHI_MODERADA = 1500;
export const COBERTURA_RENDA = 0.7;
export const COBERTURA_EQUILIBRADA = 0.4;

const TOP_EMPRESAS = 5;
const TOP_SUBINDUSTRIAS = 3;
const DEFAULT_SORT = 'marketCapShare-desc';

const CONCENTRATION_CLASS = {
  Alta: 'si-badge--high',
  Moderada: 'si-badge--moderate',
  Baixa: 'si-badge--low',
};

const PROFILE_CLASS = {
  Renda: 'si-badge--income',
  Equilibrado: 'si-badge--balanced',
  Crescimento: 'si-badge--growth',
};

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function positiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function yieldOf(company) {
  return positiveNumber(company && company.dividendYield);
}

export function median(values) {
  const nums = (values || [])
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map(Number)
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
  if (nums.length === 0) return 0;
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 === 1 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

/** Herfindahl-Hirschman Index (0–10 000) sobre uma lista de market caps. */
export function hhi(values) {
  const caps = (values || []).map(positiveNumber).filter((v) => v > 0);
  const total = caps.reduce((sum, v) => sum + v, 0);
  if (total <= 0) return 0;
  const squares = caps.reduce((sum, v) => sum + (v / total) ** 2, 0);
  return round(squares * 10000, 1);
}

export function classifyConcentration(index) {
  if (index >= HHI_ALTA) return 'Alta';
  if (index >= HHI_MODERADA) return 'Moderada';
  return 'Baixa';
}

export function classifyIncomeProfile(coverage) {
  if (coverage >= COBERTURA_RENDA) return 'Renda';
  if (coverage >= COBERTURA_EQUILIBRADA) return 'Equilibrado';
  return 'Crescimento';
}

export function formatShare(value) {
  const num = Number(value);
  return Number.isFinite(num) ? `${(num * 100).toFixed(1)}%` : '0.0%';
}

export function formatHhi(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

function sectorMarketCap(companies) {
  return (companies || []).reduce((sum, c) => sum + positiveNumber(c.marketCap), 0);
}

function topCompanies(companies, total) {
  return (companies || [])
    .filter((c) => positiveNumber(c.marketCap) > 0)
    .slice()
    .sort(
      (a, b) =>
        positiveNumber(b.marketCap) - positiveNumber(a.marketCap) ||
        String(a.symbol).localeCompare(String(b.symbol))
    )
    .slice(0, TOP_EMPRESAS)
    .map((c) => ({
      symbol: c.symbol || 'N/D',
      name: c.name || c.symbol || 'N/D',
      marketCap: positiveNumber(c.marketCap),
      weight: total > 0 ? round(positiveNumber(c.marketCap) / total, 4) : 0,
    }));
}

function topSubIndustries(companies, total) {
  const map = new Map();
  for (const company of companies || []) {
    const name = company.subIndustry || 'N/D';
    if (!map.has(name)) map.set(name, { name, count: 0, marketCap: 0 });
    const entry = map.get(name);
    entry.count += 1;
    entry.marketCap += positiveNumber(company.marketCap);
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || b.marketCap - a.marketCap || a.name.localeCompare(b.name))
    .slice(0, TOP_SUBINDUSTRIAS)
    .map((entry) => ({
      name: entry.name,
      count: entry.count,
      weight: total > 0 ? round(entry.marketCap / total, 4) : 0,
    }));
}

/** Métricas de um setor; `indexMarketCap` serve de base à participação. */
export function buildSectorMetrics(sector, indexMarketCap = 0) {
  const companies = Array.isArray(sector && sector.companies) ? sector.companies : [];
  const id = (sector && sector.id) || 'N/D';
  const name = (sector && sector.name) || id;
  const total = sectorMarketCap(companies);
  const base = positiveNumber(indexMarketCap) || total;

  const payers = companies.filter((c) => yieldOf(c) > 0);
  const yieldSum = payers.reduce((sum, c) => sum + yieldOf(c), 0);
  const coverage = companies.length > 0 ? payers.length / companies.length : 0;
  const top = topCompanies(companies, total);
  const concentrationIndex = hhi(companies.map((c) => c.marketCap));

  return {
    id,
    name,
    companyCount: companies.length,
    totalMarketCap: total,
    marketCapShare: base > 0 ? round(total / base, 4) : 0,
    medianMarketCap: median(companies.map((c) => c.marketCap)),
    averageMarketCap: companies.length > 0 ? Math.round(total / companies.length) : 0,
    hhi: concentrationIndex,
    concentration: classifyConcentration(concentrationIndex),
    topCompany: top[0] || null,
    topCompanies: top,
    top3Weight: round(
      top.slice(0, 3).reduce((sum, c) => sum + c.weight, 0),
      4
    ),
    dividendPayers: payers.length,
    dividendCoverage: round(coverage, 4),
    averageDividendYield: payers.length > 0 ? round(yieldSum / payers.length, 2) : 0,
    incomeProfile: classifyIncomeProfile(coverage),
    subIndustryCount: new Set(companies.map((c) => c.subIndustry || 'N/D')).size,
    topSubIndustries: topSubIndustries(companies, total),
    rank: 0,
  };
}

function summary(sector, field) {
  if (!sector) return null;
  return { id: sector.id, name: sector.name, [field]: sector[field] };
}

function buildHighlights(sectors) {
  if (sectors.length === 0) {
    return {
      largestSector: null,
      mostConcentrated: null,
      mostDiversified: null,
      highestYield: null,
      widestSector: null,
    };
  }

  const largest = sectors[0];
  const concentrated = sectors.reduce((best, s) => (s.hhi > best.hhi ? s : best));
  const diversified = sectors.reduce((best, s) => (s.hhi < best.hhi ? s : best));
  const withYield = sectors.filter((s) => s.averageDividendYield > 0);
  const bestYield = withYield.length
    ? withYield.reduce((best, s) => (s.averageDividendYield > best.averageDividendYield ? s : best))
    : null;
  const widest = sectors.reduce((best, s) => (s.companyCount > best.companyCount ? s : best));

  return {
    largestSector: {
      id: largest.id,
      name: largest.name,
      marketCap: largest.totalMarketCap,
      share: largest.marketCapShare,
    },
    mostConcentrated: summary(concentrated, 'hhi'),
    mostDiversified: summary(diversified, 'hhi'),
    highestYield: summary(bestYield, 'averageDividendYield'),
    widestSector: summary(widest, 'companyCount'),
  };
}

/** Relatório completo de inteligência setorial. */
export function buildSectorIntelligence(sectors, options = {}) {
  const list = (Array.isArray(sectors) ? sectors : []).filter((s) => s && s.id);
  const indexTotal = list.reduce((sum, s) => sum + sectorMarketCap(s.companies), 0);

  const metrics = list
    .map((s) => buildSectorMetrics(s, indexTotal))
    .sort((a, b) => b.totalMarketCap - a.totalMarketCap || a.name.localeCompare(b.name));

  metrics.forEach((sector, index) => {
    sector.rank = index + 1;
  });

  const allCompanies = list.flatMap((s) => (Array.isArray(s.companies) ? s.companies : []));
  const payers = allCompanies.filter((c) => yieldOf(c) > 0);
  const dates = list
    .map((s) => s.generatedAt)
    .filter(Boolean)
    .sort();

  return {
    generatedAt: options.generatedAt || dates[dates.length - 1] || null,
    sectorCount: metrics.length,
    totalCompanies: allCompanies.length,
    totalMarketCap: indexTotal,
    dividendPayers: payers.length,
    dividendCoverage: allCompanies.length > 0 ? round(payers.length / allCompanies.length, 4) : 0,
    indexHhi: hhi(allCompanies.map((c) => c.marketCap)),
    sectors: metrics,
    highlights: buildHighlights(metrics),
  };
}

/** Ordena as métricas por campo (ex.: 'hhi-desc', 'name-asc'). */
export function sortSectorMetrics(sectors, sortKey = DEFAULT_SORT) {
  const key = String(sortKey || DEFAULT_SORT);
  const separator = key.lastIndexOf('-');
  const field = separator > 0 ? key.slice(0, separator) : key;
  const order = separator > 0 ? key.slice(separator + 1) : 'desc';

  return [...(sectors || [])].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (typeof valueA === 'string' || typeof valueB === 'string') {
      const cmp = String(valueA ?? '').localeCompare(String(valueB ?? ''), 'pt');
      return order === 'asc' ? cmp : -cmp;
    }

    const cmp = (Number(valueA) || 0) - (Number(valueB) || 0);
    if (cmp !== 0) return order === 'asc' ? cmp : -cmp;
    return String(a.name).localeCompare(String(b.name), 'pt');
  });
}

// ========== RENDERIZAÇÃO ==========

function loadingHtml() {
  return `
    <div class="si-view">
      <div class="si-loading">
        <div class="loading-spinner"></div>
        <p>A calcular inteligência setorial...</p>
      </div>
    </div>
  `;
}

function errorHtml(message) {
  return `
    <div class="si-view">
      <div class="si-empty">
        <h3>⚠️ ${escapeHtml(message)}</h3>
        <p>Não foi possível carregar as métricas dos setores. Verifique a ligação à API.</p>
      </div>
    </div>
  `;
}

function detailHtml(sector) {
  const companies = sector.topCompanies || [];
  const companyList = companies.length
    ? companies
        .map(
          (company, index) => `
          <button
            type="button"
            class="si-company"
            data-symbol="${escapeHtml(company.symbol)}"
            data-name="${escapeHtml(company.name)}"
          >
            <span class="si-company-rank">${index + 1}</span>
            <span class="si-company-symbol">${escapeHtml(company.symbol)}</span>
            <span class="si-company-name">${escapeHtml(company.name)}</span>
            <span class="si-company-cap">${formatMarketCap(company.marketCap)}</span>
            <span class="si-company-weight">${formatShare(company.weight)}</span>
          </button>`
        )
        .join('')
    : '<p class="si-muted">Sem empresas com market cap disponível.</p>';

  const subIndustries = (sector.topSubIndustries || []).length
    ? `<ul class="si-subindustries">
        ${sector.topSubIndustries
          .map(
            (sub) => `
          <li>
            <span>${escapeHtml(sub.name)}</span>
            <span class="si-muted">${sub.count} · ${formatShare(sub.weight)}</span>
          </li>`
          )
          .join('')}
      </ul>`
    : '<p class="si-muted">Sem subindústrias disponíveis.</p>';

  return `
    <div class="si-detail-grid">
      <section>
        <h4>Top 5 empresas por market cap</h4>
        <div class="si-company-list">${companyList}</div>
      </section>
      <section>
        <h4>Principais subindústrias</h4>
        ${subIndustries}
      </section>
    </div>
  `;
}

function rowHtml(sector) {
  const id = escapeHtml(sector.id);
  const top = sector.topCompany || (sector.topCompanies && sector.topCompanies[0]);
  const concentrationClass = CONCENTRATION_CLASS[sector.concentration] || 'si-badge--low';
  const profileClass = PROFILE_CLASS[sector.incomeProfile] || 'si-badge--balanced';
  const sharePct = Math.min(100, (Number(sector.marketCapShare) || 0) * 100).toFixed(1);

  return `
    <tr class="si-row" data-sector="${id}">
      <td class="si-rank">${sector.rank}</td>
      <td class="si-sector-cell">
        <button
          type="button"
          class="si-sector-btn"
          aria-expanded="false"
          aria-controls="si-detail-${id}"
        >
          <span class="si-caret" aria-hidden="true">▸</span>
          <span>${escapeHtml(sector.name)}</span>
        </button>
      </td>
      <td class="si-num">${sector.companyCount}</td>
      <td class="si-num">${formatMarketCap(sector.totalMarketCap)}</td>
      <td class="si-share">
        <div class="si-bar">
          <span class="si-bar-fill" style="width: ${sharePct}%"></span>
        </div>
        <span class="si-share-value">${formatShare(sector.marketCapShare)}</span>
      </td>
      <td class="si-num">${formatHhi(sector.hhi)}</td>
      <td><span class="si-badge ${concentrationClass}">${escapeHtml(sector.concentration)}</span></td>
      <td>
        ${
          top
            ? `<strong>${escapeHtml(top.symbol)}</strong>
               <span class="si-muted">${formatShare(top.weight)}</span>`
            : '<span class="si-muted">—</span>'
        }
      </td>
      <td class="si-num">${formatShare(sector.dividendCoverage)}</td>
      <td class="si-num">${(Number(sector.averageDividendYield) || 0).toFixed(2)}%</td>
      <td><span class="si-badge ${profileClass}">${escapeHtml(sector.incomeProfile)}</span></td>
    </tr>
    <tr class="si-detail" id="si-detail-${id}" hidden>
      <td colspan="11">${detailHtml(sector)}</td>
    </tr>
  `;
}

function statsHtml(data) {
  const cards = [
    ['Setores', String(data.sectorCount ?? 0)],
    ['Empresas', String(data.totalCompanies ?? 0)],
    ['Market cap total', formatMarketCap(data.totalMarketCap)],
    ['Cobertura de dividendos', formatShare(data.dividendCoverage)],
    ['HHI do índice', formatHhi(data.indexHhi)],
  ];

  return cards
    .map(
      ([label, value]) => `
      <div class="si-stat">
        <span class="si-stat-label">${label}</span>
        <span class="si-stat-value">${value}</span>
      </div>`
    )
    .join('');
}

function highlightsHtml(highlights) {
  const h = highlights || {};
  const cards = [
    {
      icon: '🏆',
      label: 'Maior setor',
      name: h.largestSector?.name,
      detail: h.largestSector ? `${formatShare(h.largestSector.share)} do índice` : 'Sem dados',
    },
    {
      icon: '🎯',
      label: 'Mais concentrado',
      name: h.mostConcentrated?.name,
      detail: h.mostConcentrated ? `HHI ${formatHhi(h.mostConcentrated.hhi)}` : 'Sem dados',
    },
    {
      icon: '🧩',
      label: 'Mais diversificado',
      name: h.mostDiversified?.name,
      detail: h.mostDiversified ? `HHI ${formatHhi(h.mostDiversified.hhi)}` : 'Sem dados',
    },
    {
      icon: '💰',
      label: 'Maior yield médio',
      name: h.highestYield?.name,
      detail: h.highestYield
        ? `${Number(h.highestYield.averageDividendYield).toFixed(2)}% (pagadoras)`
        : 'Sem pagadoras',
    },
  ];

  return cards
    .map(
      (card) => `
      <div class="si-highlight">
        <span class="si-highlight-icon" aria-hidden="true">${card.icon}</span>
        <div>
          <span class="si-highlight-label">${card.label}</span>
          <strong class="si-highlight-name">${escapeHtml(card.name || '—')}</strong>
          <span class="si-highlight-detail">${escapeHtml(card.detail)}</span>
        </div>
      </div>`
    )
    .join('');
}

function generatedLabel(generatedAt) {
  if (!generatedAt) return 'data desconhecida';
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return escapeHtml(String(generatedAt));
  return date.toLocaleDateString('pt-BR');
}

/**
 * Renderiza o painel de inteligência setorial.
 * @param {string} containerId
 * @param {object} data Relatório (formato de buildSectorIntelligence).
 */
export function renderSectorIntelligence(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const sectors = Array.isArray(data && data.sectors) ? data.sectors : [];
  if (sectors.length === 0) {
    container.innerHTML = errorHtml('Sem dados setoriais');
    return;
  }

  const sourceLabel =
    data.source === 'local' ? 'calculado no browser' : 'servido pela API do S&P 500';

  container.innerHTML = `
    <div class="si-view">
      <header class="si-header">
        <h2>🧠 Inteligência Setorial GICS</h2>
        <p class="subtitle">
          Comparação dos ${data.sectorCount} setores do S&amp;P 500 por tamanho, concentração,
          amplitude e perfil de dividendos.
        </p>
        <span class="si-source">
          Dados de ${generatedLabel(data.generatedAt)} · ${sourceLabel}
        </span>
      </header>

      <div class="si-stats">${statsHtml(data)}</div>

      <div class="si-highlights">${highlightsHtml(data.highlights)}</div>

      <section class="si-panel">
        <div class="si-toolbar">
          <h3>Ranking dos setores</h3>
          <label class="si-sort" for="si-sort">
            Ordenar por
            <select id="si-sort">
              <option value="marketCapShare-desc">Participação no índice</option>
              <option value="hhi-desc">Concentração (HHI)</option>
              <option value="dividendCoverage-desc">Cobertura de dividendos</option>
              <option value="averageDividendYield-desc">Yield médio</option>
              <option value="companyCount-desc">Nº de empresas</option>
              <option value="name-asc">Nome</option>
            </select>
          </label>
        </div>

        <div class="si-table-wrapper">
          <table class="si-table">
            <caption class="si-caption">
              Métricas por setor GICS — clique num setor para ver as maiores empresas.
            </caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Setor</th>
                <th scope="col">Empresas</th>
                <th scope="col">Market cap</th>
                <th scope="col">Participação</th>
                <th scope="col">HHI</th>
                <th scope="col">Concentração</th>
                <th scope="col">Top empresa</th>
                <th scope="col">Cobertura div.</th>
                <th scope="col">Yield médio</th>
                <th scope="col">Perfil</th>
              </tr>
            </thead>
            <tbody id="si-tbody"></tbody>
          </table>
        </div>
      </section>

      <p class="si-note">
        <strong>Metodologia:</strong> HHI calculado sobre o market cap (0–10 000; ≥
        ${formatHhi(HHI_ALTA)} concentração alta, ${formatHhi(HHI_MODERADA)}–
        ${formatHhi(HHI_ALTA)} moderada). Cobertura = percentagem de empresas com dividend
        yield positivo; o yield médio considera apenas as pagadoras. Perfil: Renda ≥ 70%,
        Equilibrado 40–70%, Crescimento &lt; 40%.
      </p>
    </div>
  `;

  const sortSelect = container.querySelector('#si-sort');
  const tbody = container.querySelector('#si-tbody');
  if (!sortSelect || !tbody) return;

  const expanded = new Set();

  const bindRows = () => {
    tbody.querySelectorAll('.si-sector-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const row = button.closest('tr');
        const detail = row.nextElementSibling;
        const sectorId = row.dataset.sector;
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        button.setAttribute('aria-expanded', String(!isOpen));
        const caret = button.querySelector('.si-caret');
        if (caret) caret.textContent = isOpen ? '▸' : '▾';
        if (detail) detail.hidden = isOpen;

        if (isOpen) expanded.delete(sectorId);
        else expanded.add(sectorId);
      });
    });

    tbody.querySelectorAll('.si-company').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof window.openCompanyDetails === 'function') {
          window.openCompanyDetails({
            symbol: button.dataset.symbol,
            name: button.dataset.name,
          });
        }
      });
    });
  };

  const paint = () => {
    const sorted = sortSectorMetrics(sectors, sortSelect.value);
    tbody.innerHTML = sorted.map(rowHtml).join('');

    expanded.forEach((sectorId) => {
      const row = tbody.querySelector(`tr[data-sector="${sectorId}"]`);
      if (!row) return;
      const button = row.querySelector('.si-sector-btn');
      const detail = row.nextElementSibling;
      if (button) button.setAttribute('aria-expanded', 'true');
      const caret = button && button.querySelector('.si-caret');
      if (caret) caret.textContent = '▾';
      if (detail) detail.hidden = false;
    });

    bindRows();
  };

  sortSelect.addEventListener('change', paint);
  paint();
}

// ========== CARREGAMENTO ==========

function hasSectors(data) {
  return Boolean(data && Array.isArray(data.sectors) && data.sectors.length > 0);
}

/** Recalcula o relatório a partir das rotas por setor (fallback sem a rota nova). */
export async function fetchSectorIntelligenceFallback() {
  const response = await fetch(`${API_BASE_URL}/api/setores`);
  if (!response.ok) throw new Error(`HTTP ${response.status} ao listar setores`);

  const payload = await response.json();
  const ids = Array.isArray(payload.setores) ? payload.setores : [];

  const datasets = await Promise.all(
    ids.map(async (id) => {
      try {
        const sectorResponse = await fetch(`${API_BASE_URL}/api/setor/${id}`);
        if (!sectorResponse.ok) return null;
        const sectorPayload = await sectorResponse.json();
        const dados = sectorPayload.dados || {};
        return {
          id,
          name: dados.sector || SECTORS.find((s) => s.id === id)?.name || id,
          companies: Array.isArray(dados.companies) ? dados.companies : [],
          generatedAt: dados.generatedAt || null,
        };
      } catch (erro) {
        console.error(`Erro ao carregar o setor ${id}:`, erro);
        return null;
      }
    })
  );

  return buildSectorIntelligence(datasets.filter(Boolean));
}

export async function loadSectorIntelligence(containerId = 'sector-intelligence-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  container.innerHTML = loadingHtml();

  let data = await getSectorIntelligence();
  let source = 'api';

  if (!hasSectors(data)) {
    try {
      data = await fetchSectorIntelligenceFallback();
      source = 'local';
    } catch (erro) {
      console.error('Erro ao calcular inteligência setorial no browser:', erro);
      container.innerHTML = errorHtml('Dados indisponíveis');
      return;
    }
  }

  if (!hasSectors(data)) {
    container.innerHTML = errorHtml('Dados indisponíveis');
    return;
  }

  renderSectorIntelligence(containerId, { ...data, source });
}
