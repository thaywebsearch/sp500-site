// ========== DOW JONES MODULE ==========

import { escapeHtml } from './utils.js';

export const DOW_JONES = [
  { company: '3M', ticker: 'MMM', sector: 'Industrials' },
  { company: 'American Express', ticker: 'AXP', sector: 'Financials' },
  { company: 'Amgen', ticker: 'AMGN', sector: 'Health Care' },
  { company: 'Apple', ticker: 'AAPL', sector: 'Information Technology' },
  { company: 'Boeing', ticker: 'BA', sector: 'Industrials' },
  { company: 'Caterpillar', ticker: 'CAT', sector: 'Industrials' },
  { company: 'Chevron', ticker: 'CVX', sector: 'Energy' },
  { company: 'Cisco Systems', ticker: 'CSCO', sector: 'Information Technology' },
  { company: 'Coca-Cola', ticker: 'KO', sector: 'Consumer Staples' },
  { company: 'Dow Inc.', ticker: 'DOW', sector: 'Materials' },
  { company: 'Goldman Sachs', ticker: 'GS', sector: 'Financials' },
  { company: 'Home Depot', ticker: 'HD', sector: 'Consumer Discretionary' },
  { company: 'Honeywell', ticker: 'HON', sector: 'Industrials' },
  { company: 'IBM', ticker: 'IBM', sector: 'Information Technology' },
  { company: 'Intel', ticker: 'INTC', sector: 'Information Technology' },
  { company: 'Johnson & Johnson', ticker: 'JNJ', sector: 'Health Care' },
  { company: 'JPMorgan Chase', ticker: 'JPM', sector: 'Financials' },
  { company: "McDonald's", ticker: 'MCD', sector: 'Consumer Discretionary' },
  { company: 'Merck', ticker: 'MRK', sector: 'Health Care' },
  { company: 'Microsoft', ticker: 'MSFT', sector: 'Information Technology' },
  { company: 'Nike', ticker: 'NKE', sector: 'Consumer Discretionary' },
  { company: 'Procter & Gamble', ticker: 'PG', sector: 'Consumer Staples' },
  { company: 'Salesforce', ticker: 'CRM', sector: 'Information Technology' },
  { company: 'The Travelers Companies', ticker: 'TRV', sector: 'Financials' },
  { company: 'UnitedHealth Group', ticker: 'UNH', sector: 'Health Care' },
  { company: 'Verizon', ticker: 'VZ', sector: 'Communication Services' },
  { company: 'Visa', ticker: 'V', sector: 'Financials' },
  { company: 'Walgreens Boots Alliance', ticker: 'WBA', sector: 'Consumer Staples' },
  { company: 'Walt Disney', ticker: 'DIS', sector: 'Communication Services' },
  { company: 'Nvidia', ticker: 'NVDA', sector: 'Information Technology' },
];

const SECTOR_COLORS = {
  'Communication Services': '#00d4ff',
  'Consumer Discretionary': '#ffab00',
  'Consumer Staples': '#00e676',
  Energy: '#ff5252',
  Financials: '#ba68c8',
  'Health Care': '#29b6f6',
  Industrials: '#ffa726',
  'Information Technology': '#00d4ff',
  Materials: '#66bb6a',
  'Real Estate': '#ec407a',
  Utilities: '#42a5f5',
};

export function sectorSlug(sector) {
  return String(sector || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sectorColor(sector) {
  return SECTOR_COLORS[sector] || '#00d4ff';
}

export function getDowSectorClass(sector) {
  return `dow-sector--${sectorSlug(sector)}`;
}

export function filterDowJones(list, { search = '', sector = '' } = {}) {
  const term = String(search).toLowerCase().trim();
  return (list || []).filter((c) => {
    const matchesSearch =
      !term ||
      String(c.company).toLowerCase().includes(term) ||
      String(c.ticker).toLowerCase().includes(term);
    const matchesSector = !sector || c.sector === sector;
    return matchesSearch && matchesSector;
  });
}

export function sortDowJones(list, sortBy = 'company') {
  return [...(list || [])].sort((a, b) => {
    switch (sortBy) {
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      case 'sector':
        return a.sector.localeCompare(b.sector) || a.company.localeCompare(b.company);
      default:
        return a.company.localeCompare(b.company);
    }
  });
}

export function dowSectorOptions(list) {
  return [...new Set((list || []).map((c) => c.sector))].sort();
}

export function sectorBreakdown(list) {
  const groups = new Map();
  (list || []).forEach((c) => {
    if (!groups.has(c.sector)) groups.set(c.sector, []);
    groups.get(c.sector).push(c.company);
  });
  return [...groups.entries()]
    .map(([sector, companies]) => ({ sector, companies, count: companies.length }))
    .sort((a, b) => b.count - a.count || a.sector.localeCompare(b.sector));
}

export function techCount(list) {
  return (list || []).filter((c) => c.sector === 'Information Technology').length;
}

export function renderDowCards(list) {
  const cards = (list || [])
    .map(
      (c) => `
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${escapeHtml(c.company)}</h3>
          <span class="dow-ticker">${escapeHtml(c.ticker)}</span>
        </div>
        <span class="dow-sector ${getDowSectorClass(c.sector)}">${escapeHtml(c.sector)}</span>
      </article>`
    )
    .join('');
  return `<div class="dow-cards">${cards}</div>`;
}

export function renderDowTable(list) {
  const rows = (list || [])
    .map(
      (c) => `
      <tr>
        <td><strong>${escapeHtml(c.company)}</strong></td>
        <td><span class="dow-ticker">${escapeHtml(c.ticker)}</span></td>
        <td><span class="dow-sector ${getDowSectorClass(c.sector)}">${escapeHtml(c.sector)}</span></td>
      </tr>`
    )
    .join('');
  return `
    <div class="dow-table-wrapper">
      <table class="dow-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function renderDowJones(containerId = 'dow-jones-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const state = { search: '', sector: '', sortBy: 'company', view: 'cards' };

  const totalSectors = dowSectorOptions(DOW_JONES).length;
  const optionsHtml = dowSectorOptions(DOW_JONES)
    .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
    .join('');

  const breakdownHtml = sectorBreakdown(DOW_JONES)
    .map(
      (group) => `
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${sectorColor(group.sector)}">
          <span>${escapeHtml(group.sector)}</span>
          <span class="dow-breakdown-count">${group.count}</span>
        </div>
        <p class="dow-breakdown-list">${group.companies.map((c) => escapeHtml(c)).join(', ')}</p>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <div class="dow-jones-view">
      <header class="dow-header">
        <div class="dow-header-content">
          <h2>Dow Jones 30</h2>
          <p>📈 30 maiores empresas - índice blue chip dos EUA</p>
        </div>
        <div class="dow-stats">
          <div class="dow-stat">
            <span class="dow-stat-value">${DOW_JONES.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${totalSectors}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${techCount(DOW_JONES)}</span>
            <span class="dow-stat-label">Tech</span>
          </div>
        </div>
      </header>

      <div class="dow-filters">
        <div class="dow-filter">
          <label for="dow-search">Buscar</label>
          <input type="text" id="dow-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="dow-filter">
          <label for="dow-sector">Setor</label>
          <select id="dow-sector">
            <option value="">Todos os Setores</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="dow-filter">
          <label for="dow-sort">Ordenar por</label>
          <select id="dow-sort">
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="dow-view-toggle" role="tablist">
        <button class="dow-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="dow-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="dow-results" class="dow-results"></div>

      <section class="dow-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="dow-breakdown-grid">${breakdownHtml}</div>
      </section>

      <aside class="dow-info">
        <strong>💡 Sobre o Dow Jones Industrial Average (DJIA):</strong> um dos índices de ações
        mais antigos e respeitados do mundo, composto por 30 grandes empresas americanas. É
        frequentemente usado como indicador da saúde da economia dos EUA. As suas empresas são
        consideradas "blue chips" e o índice é ponderado por preço.
      </aside>
    </div>
  `;

  const resultsEl = container.querySelector('#dow-results');
  const searchEl = container.querySelector('#dow-search');
  const sectorEl = container.querySelector('#dow-sector');
  const sortEl = container.querySelector('#dow-sort');
  const viewButtons = container.querySelectorAll('.dow-view-btn');

  function update() {
    const filtered = sortDowJones(
      filterDowJones(DOW_JONES, { search: state.search, sector: state.sector }),
      state.sortBy
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="dow-empty">Nenhuma empresa encontrada.</p>';
      return;
    }

    resultsEl.innerHTML =
      state.view === 'table' ? renderDowTable(filtered) : renderDowCards(filtered);

    if (state.view === 'table') {
      resultsEl.querySelectorAll('th[data-sort]').forEach((th) => {
        th.addEventListener('click', () => {
          state.sortBy = th.dataset.sort;
          if (sortEl) sortEl.value = state.sortBy;
          update();
        });
      });
    }
  }

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      state.search = searchEl.value;
      update();
    });
  }

  if (sectorEl) {
    sectorEl.addEventListener('change', () => {
      state.sector = sectorEl.value;
      update();
    });
  }

  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sortBy = sortEl.value;
      update();
    });
  }

  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      viewButtons.forEach((b) => b.classList.toggle('active', b === btn));
      update();
    });
  });

  update();
}
