// ========== DIVIDENDOS MODULE ==========

import { escapeHtml } from './utils.js';

export function getYield(company) {
  const value = Number(company && company.dividendYield);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function getDividendPayers(companies) {
  return (companies || []).filter((c) => getYield(c) > 0);
}

export function averageYield(companies) {
  const payers = getDividendPayers(companies);
  if (payers.length === 0) return 0;
  const total = payers.reduce((sum, c) => sum + getYield(c), 0);
  return total / payers.length;
}

export function medianYield(companies) {
  const values = getDividendPayers(companies)
    .map(getYield)
    .sort((a, b) => a - b);
  if (values.length === 0) return 0;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
}

export function buildDividendSummary(companies) {
  const list = companies || [];
  const payers = getDividendPayers(list);
  const yields = payers.map(getYield);
  return {
    total: list.length,
    payers: payers.length,
    nonPayers: list.length - payers.length,
    payerRatio: list.length > 0 ? payers.length / list.length : 0,
    avgYield: averageYield(list),
    medianYield: medianYield(list),
    maxYield: yields.length > 0 ? Math.max(...yields) : 0,
  };
}

export function topByYield(companies, limit = 15) {
  return getDividendPayers(companies)
    .slice()
    .sort((a, b) => getYield(b) - getYield(a) || String(a.symbol).localeCompare(String(b.symbol)))
    .slice(0, limit);
}

const YIELD_BUCKETS = [
  { label: '0–1%', min: 0, max: 1 },
  { label: '1–2%', min: 1, max: 2 },
  { label: '2–3%', min: 2, max: 3 },
  { label: '3–4%', min: 3, max: 4 },
  { label: '4–5%', min: 4, max: 5 },
  { label: '5%+', min: 5, max: Infinity },
];

export function yieldBuckets(companies) {
  const payers = getDividendPayers(companies);
  return YIELD_BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: payers.filter((c) => {
      const value = getYield(c);
      return value >= bucket.min && value < bucket.max;
    }).length,
  }));
}

export function sectorDividendStats(companies) {
  const bySector = new Map();
  for (const company of companies || []) {
    const name = company.sectorName || company.sector || 'N/A';
    if (!bySector.has(name)) {
      bySector.set(name, { sector: name, total: 0, payers: 0, yieldSum: 0 });
    }
    const entry = bySector.get(name);
    entry.total += 1;
    const value = getYield(company);
    if (value > 0) {
      entry.payers += 1;
      entry.yieldSum += value;
    }
  }
  return Array.from(bySector.values())
    .map((e) => ({
      sector: e.sector,
      total: e.total,
      payers: e.payers,
      avgYield: e.payers > 0 ? e.yieldSum / e.payers : 0,
    }))
    .sort((a, b) => b.avgYield - a.avgYield || a.sector.localeCompare(b.sector));
}

const fmtYield = (value) => `${Number(value).toFixed(2)}%`;
const fmtPercent = (value) => `${(value * 100).toFixed(0)}%`;

export function renderDividends(companies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const list = companies || [];
  if (list.length === 0) {
    container.innerHTML =
      '<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';
    return;
  }

  const summary = buildDividendSummary(list);
  const top = topByYield(list);
  const buckets = yieldBuckets(list);
  const sectors = sectorDividendStats(list);
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  const topRows = top
    .map(
      (c, index) => `
      <tr class="dividend-row" data-dividend-symbol="${escapeHtml(c.symbol)}" data-dividend-name="${escapeHtml(c.name || c.symbol)}">
        <td class="col-index">${index + 1}</td>
        <td><strong>${escapeHtml(c.symbol)}</strong></td>
        <td>${escapeHtml(c.name || 'N/A')}</td>
        <td>${escapeHtml(c.sectorName || c.sector || 'N/A')}</td>
        <td class="dividend-yield">${fmtYield(getYield(c))}</td>
      </tr>`
    )
    .join('');

  const bucketRows = buckets
    .map(
      (b) => `
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${b.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${(b.count / maxBucket) * 100}%"></div>
        </div>
        <span class="dividend-bucket-count">${b.count}</span>
      </div>`
    )
    .join('');

  const sectorRows = sectors
    .map(
      (s) => `
      <tr>
        <td>${escapeHtml(s.sector)}</td>
        <td class="col-index">${s.payers} / ${s.total}</td>
        <td class="dividend-yield">${fmtYield(s.avgYield)}</td>
      </tr>`
    )
    .join('');

  container.innerHTML = `
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${summary.payers} de ${summary.total} empresas
          pagam dividendos (${fmtPercent(summary.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${summary.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${summary.payers} (${fmtPercent(summary.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${fmtYield(summary.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${fmtYield(summary.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${fmtYield(summary.maxYield)}</span>
        </div>
      </div>

      <div class="dividend-columns">
        <section class="dividend-panel">
          <h3>🏆 Top por Dividend Yield</h3>
          <table class="dividend-table">
            <thead>
              <tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Yield</th></tr>
            </thead>
            <tbody>${topRows}</tbody>
          </table>
        </section>

        <section class="dividend-panel">
          <h3>📊 Distribuição por faixa</h3>
          <div class="dividend-buckets">${bucketRows}</div>
          <p class="dividend-note">Considera apenas as ${summary.payers} empresas pagadoras.</p>
        </section>
      </div>

      <section class="dividend-panel">
        <h3>🏭 Yield médio por setor</h3>
        <table class="dividend-table">
          <thead>
            <tr><th>Setor</th><th>Pagadoras</th><th>Yield médio</th></tr>
          </thead>
          <tbody>${sectorRows}</tbody>
        </table>
      </section>
    </div>
  `;

  container.querySelectorAll('.dividend-row').forEach((row) => {
    row.addEventListener('click', () => {
      if (typeof window.openCompanyDetails === 'function') {
        window.openCompanyDetails({
          symbol: row.dataset.dividendSymbol,
          name: row.dataset.dividendName,
        });
      }
    });
  });
}
