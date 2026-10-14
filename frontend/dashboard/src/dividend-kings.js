// ========== DIVIDEND KINGS MODULE ==========

import { escapeHtml } from './utils.js';

export const DIVIDEND_KINGS = [
  { company: 'American States Water', ticker: 'AWR', sector: 'Utilities' },
  { company: 'California Water Service', ticker: 'CWT', sector: 'Utilities' },
  { company: 'Northwest Natural', ticker: 'NWN', sector: 'Utilities' },
  { company: 'Procter & Gamble', ticker: 'PG', sector: 'Consumer Defensive' },
  { company: 'Coca-Cola', ticker: 'KO', sector: 'Consumer Defensive' },
  { company: 'Johnson & Johnson', ticker: 'JNJ', sector: 'Healthcare' },
  { company: 'Colgate-Palmolive', ticker: 'CL', sector: 'Consumer Defensive' },
  { company: 'Genuine Parts', ticker: 'GPC', sector: 'Consumer Cyclical' },
  { company: 'Emerson Electric', ticker: 'EMR', sector: 'Industrials' },
  { company: 'Dover', ticker: 'DOV', sector: 'Industrials' },
  { company: "Lowe's", ticker: 'LOW', sector: 'Consumer Cyclical' },
  { company: 'Federal Realty', ticker: 'FRT', sector: 'Real Estate' },
  { company: 'ABM Industries', ticker: 'ABM', sector: 'Industrials' },
  { company: 'Stepan', ticker: 'SCL', sector: 'Basic Materials' },
  { company: 'H.B. Fuller', ticker: 'FUL', sector: 'Basic Materials' },
  { company: 'Universal Corp', ticker: 'UVV', sector: 'Consumer Defensive' },
  { company: 'Hormel Foods', ticker: 'HRL', sector: 'Consumer Defensive' },
  { company: 'Kimberly-Clark', ticker: 'KMB', sector: 'Consumer Defensive' },
  { company: 'Middlesex Water', ticker: 'MSEX', sector: 'Utilities' },
  { company: 'MSA Safety', ticker: 'MSA', sector: 'Industrials' },
  { company: 'PPG Industries', ticker: 'PPG', sector: 'Basic Materials' },
  { company: 'RPM International', ticker: 'RPM', sector: 'Basic Materials' },
  { company: 'Black Hills', ticker: 'BKH', sector: 'Utilities' },
  { company: 'National Fuel Gas', ticker: 'NFG', sector: 'Energy' },
  { company: 'PepsiCo', ticker: 'PEP', sector: 'Consumer Defensive' },
  { company: 'Altria', ticker: 'MO', sector: 'Consumer Defensive' },
  { company: 'Stanley Black & Decker', ticker: 'SWK', sector: 'Industrials' },
  { company: 'Target', ticker: 'TGT', sector: 'Consumer Cyclical' },
  { company: 'Sysco', ticker: 'SYY', sector: 'Consumer Defensive' },
  { company: 'Cincinnati Financial', ticker: 'CINF', sector: 'Financials' },
  { company: 'Tootsie Roll', ticker: 'TR', sector: 'Consumer Defensive' },
  { company: 'Gorman-Rupp', ticker: 'GRC', sector: 'Industrials' },
  { company: 'Pentair', ticker: 'PNR', sector: 'Industrials' },
  { company: 'H2O America', ticker: 'HTO', sector: 'Utilities' },
  { company: 'MGE Energy', ticker: 'MGEE', sector: 'Utilities' },
  { company: 'RLI Corp', ticker: 'RLI', sector: 'Financials' },
  { company: 'S&P Global', ticker: 'SPGI', sector: 'Financials' },
  { company: 'Automatic Data Processing', ticker: 'ADP', sector: 'Industrials' },
];

const SECTOR_COLORS = {
  'Basic Materials': '#66bb6a',
  'Consumer Cyclical': '#ffab00',
  'Consumer Defensive': '#00e676',
  Energy: '#ff5252',
  Financials: '#ba68c8',
  Healthcare: '#29b6f6',
  Industrials: '#ffa726',
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
  return SECTOR_COLORS[sector] || '#00e676';
}

export function getKingSectorClass(sector) {
  return `dk-sector--${sectorSlug(sector)}`;
}

export function filterDividendKings(list, { search = '', sector = '' } = {}) {
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

export function sortDividendKings(list, sortBy = 'company') {
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

export function kingSectorOptions(list) {
  return [...new Set((list || []).map((c) => c.sector))].sort();
}

export function kingBreakdown(list) {
  const groups = new Map();
  (list || []).forEach((c) => {
    if (!groups.has(c.sector)) groups.set(c.sector, []);
    groups.get(c.sector).push(c.company);
  });
  return [...groups.entries()]
    .map(([sector, companies]) => ({ sector, companies, count: companies.length }))
    .sort((a, b) => b.count - a.count || a.sector.localeCompare(b.sector));
}

export function renderKingCards(list) {
  const cards = (list || [])
    .map(
      (c) => `
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${escapeHtml(c.company)}</h3>
          <span class="dk-ticker">${escapeHtml(c.ticker)}</span>
        </div>
        <span class="dk-sector ${getKingSectorClass(c.sector)}">${escapeHtml(c.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`
    )
    .join('');
  return `<div class="dk-cards">${cards}</div>`;
}

export function renderKingTable(list) {
  const rows = (list || [])
    .map(
      (c) => `
      <tr>
        <td><strong>${escapeHtml(c.company)}</strong></td>
        <td><span class="dk-ticker">${escapeHtml(c.ticker)}</span></td>
        <td><span class="dk-sector ${getKingSectorClass(c.sector)}">${escapeHtml(c.sector)}</span></td>
      </tr>`
    )
    .join('');
  return `
    <div class="dk-table-wrapper">
      <table class="dk-table">
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

export function renderDividendKings(containerId = 'dividend-kings-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const state = { search: '', sector: '', sortBy: 'company', view: 'cards' };

  const totalSectors = kingSectorOptions(DIVIDEND_KINGS).length;
  const optionsHtml = kingSectorOptions(DIVIDEND_KINGS)
    .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
    .join('');

  const breakdownHtml = kingBreakdown(DIVIDEND_KINGS)
    .map(
      (group) => `
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${sectorColor(group.sector)}">
          <span>${escapeHtml(group.sector)}</span>
          <span class="dk-breakdown-count">${group.count}</span>
        </div>
        <p class="dk-breakdown-list">${group.companies.map((c) => escapeHtml(c)).join(', ')}</p>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <div class="dividend-kings-view">
      <header class="dk-header">
        <div class="dk-header-content">
          <h2>Dividend Kings</h2>
          <p>👑 50+ anos de aumento ininterrupto de dividendos</p>
        </div>
        <div class="dk-stats">
          <div class="dk-stat">
            <span class="dk-stat-value">${DIVIDEND_KINGS.length}</span>
            <span class="dk-stat-label">Empresas</span>
          </div>
          <div class="dk-stat">
            <span class="dk-stat-value">${totalSectors}</span>
            <span class="dk-stat-label">Setores</span>
          </div>
          <div class="dk-stat">
            <span class="dk-stat-value">50+</span>
            <span class="dk-stat-label">Anos de Dividendos</span>
          </div>
        </div>
      </header>

      <div class="dk-filters">
        <div class="dk-filter">
          <label for="dk-search">Buscar</label>
          <input type="text" id="dk-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="dk-filter">
          <label for="dk-sector">Setor</label>
          <select id="dk-sector">
            <option value="">Todos os Setores</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="dk-filter">
          <label for="dk-sort">Ordenar por</label>
          <select id="dk-sort">
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="dk-view-toggle" role="tablist">
        <button class="dk-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="dk-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="dk-results" class="dk-results"></div>

      <section class="dk-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="dk-breakdown-grid">${breakdownHtml}</div>
      </section>

      <aside class="dk-info">
        <strong>💡 O que são Dividend Kings?</strong> são empresas que aumentaram
        ininterruptamente os seus dividendos por mais de 50 anos consecutivos. Estão entre as
        empresas mais estáveis e rentáveis do mercado, com modelos de negócio sólidos e geração de
        caixa consistente — ideais para investidores que procuram renda passiva fiável e crescimento
        a longo prazo.
      </aside>
    </div>
  `;

  const resultsEl = container.querySelector('#dk-results');
  const searchEl = container.querySelector('#dk-search');
  const sectorEl = container.querySelector('#dk-sector');
  const sortEl = container.querySelector('#dk-sort');

  const render = () => {
    const filtered = sortDividendKings(
      filterDividendKings(DIVIDEND_KINGS, { search: state.search, sector: state.sector }),
      state.sortBy
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="dk-empty">Nenhuma empresa encontrada.</p>';
      return;
    }

    if (state.view === 'cards') {
      resultsEl.innerHTML = renderKingCards(filtered);
      return;
    }

    resultsEl.innerHTML = renderKingTable(filtered);
    resultsEl.querySelectorAll('.dk-table th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        state.sortBy = th.getAttribute('data-sort');
        if (sortEl) sortEl.value = state.sortBy;
        render();
      });
    });
  };

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      state.search = searchEl.value;
      render();
    });
  }

  if (sectorEl) {
    sectorEl.addEventListener('change', () => {
      state.sector = sectorEl.value;
      render();
    });
  }

  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sortBy = sortEl.value;
      render();
    });
  }

  container.querySelectorAll('.dk-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.getAttribute('data-view');
      container.querySelectorAll('.dk-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
}
