// ========== DIVIDEND ARISTOCRATS MODULE ==========

import { escapeHtml } from './utils.js';

import dados from './data/dividend-aristocrats.json';

export const DIVIDEND_ARISTOCRATS = dados.items;

const SECTOR_COLORS = {
  'Consumer Staples': '#00e676',
  'Communication Services': '#00d4ff',
  'Consumer Discretionary': '#ffab00',
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
  return SECTOR_COLORS[sector] || '#ffc107';
}

export function getAristocratSectorClass(sector) {
  return `da-sector--${sectorSlug(sector)}`;
}

export function maxYears(list) {
  return (list || []).reduce((max, c) => Math.max(max, Number(c.years) || 0), 0);
}

export function filterDividendAristocrats(list, { search = '', sector = '', minYears = 0 } = {}) {
  const term = String(search).toLowerCase().trim();
  const min = Number(minYears) || 0;
  return (list || []).filter((c) => {
    const matchesSearch =
      !term ||
      String(c.company).toLowerCase().includes(term) ||
      String(c.ticker).toLowerCase().includes(term);
    const matchesSector = !sector || c.sector === sector;
    const matchesYears = (Number(c.years) || 0) >= min;
    return matchesSearch && matchesSector && matchesYears;
  });
}

export function sortDividendAristocrats(list, sortBy = 'years') {
  return [...(list || [])].sort((a, b) => {
    switch (sortBy) {
      case 'company':
        return a.company.localeCompare(b.company);
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      case 'sector':
        return a.sector.localeCompare(b.sector) || a.company.localeCompare(b.company);
      case 'years':
        return (b.years || 0) - (a.years || 0) || a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });
}

export function aristocratSectorOptions(list) {
  return [...new Set((list || []).map((c) => c.sector))].sort();
}

export function aristocratBreakdown(list) {
  const groups = new Map();
  (list || []).forEach((c) => {
    if (!groups.has(c.sector)) groups.set(c.sector, []);
    groups.get(c.sector).push(c.company);
  });
  return [...groups.entries()]
    .map(([sector, companies]) => ({ sector, companies, count: companies.length }))
    .sort((a, b) => b.count - a.count || a.sector.localeCompare(b.sector));
}

export function renderAristocratCards(list) {
  const cards = (list || [])
    .map(
      (c) => `
      <article class="da-card">
        <div class="da-card-head">
          <h3>${escapeHtml(c.company)}</h3>
          <span class="da-ticker">${escapeHtml(c.ticker)}</span>
        </div>
        <span class="da-sector ${getAristocratSectorClass(c.sector)}">${escapeHtml(c.sector)}</span>
        <div class="da-years">🏆 ${escapeHtml(String(c.years))} Anos de Aumento</div>
      </article>`
    )
    .join('');
  return `<div class="da-cards">${cards}</div>`;
}

export function renderAristocratTable(list) {
  const rows = (list || [])
    .map(
      (c) => `
      <tr>
        <td><strong>${escapeHtml(c.company)}</strong></td>
        <td><span class="da-ticker">${escapeHtml(c.ticker)}</span></td>
        <td><span class="da-sector ${getAristocratSectorClass(c.sector)}">${escapeHtml(
          c.sector
        )}</span></td>
        <td><strong class="da-years-value">${escapeHtml(String(c.years))}</strong></td>
      </tr>`
    )
    .join('');
  return `
    <div class="da-table-wrapper">
      <table class="da-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
            <th data-sort="years">Anos de Aumento</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function renderDividendAristocrats(containerId = 'dividend-aristocrats-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('❌ dividend-aristocrats-view não encontrado!');
    return;
  }

  const state = { search: '', sector: '', minYears: 0, sortBy: 'years', view: 'cards' };

  const totalSectors = aristocratSectorOptions(DIVIDEND_ARISTOCRATS).length;
  const optionsHtml = aristocratSectorOptions(DIVIDEND_ARISTOCRATS)
    .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
    .join('');

  const breakdownHtml = aristocratBreakdown(DIVIDEND_ARISTOCRATS)
    .map(
      (group) => `
      <div class="da-breakdown-item">
        <div class="da-breakdown-head" style="color: ${sectorColor(group.sector)}">
          <span>${escapeHtml(group.sector)}</span>
          <span class="da-breakdown-count">${group.count}</span>
        </div>
        <p class="da-breakdown-list">${group.companies.map((c) => escapeHtml(c)).join(', ')}</p>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <div class="dividend-aristocrats-view">
      <header class="da-header">
        <div class="da-header-content">
          <h2>Dividend Aristocrats</h2>
          <p>🏆 Empresas do S&amp;P 500 com 25+ anos de aumento de dividendos</p>
        </div>
        <div class="da-stats">
          <div class="da-stat">
            <span class="da-stat-value">${DIVIDEND_ARISTOCRATS.length}</span>
            <span class="da-stat-label">Empresas</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${totalSectors}</span>
            <span class="da-stat-label">Setores</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${maxYears(DIVIDEND_ARISTOCRATS)}</span>
            <span class="da-stat-label">Maior Sequência (anos)</span>
          </div>
        </div>
      </header>

      <div class="da-filters">
        <div class="da-filter">
          <label for="da-search">Buscar</label>
          <input type="text" id="da-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="da-filter">
          <label for="da-sector">Setor</label>
          <select id="da-sector">
            <option value="">Todos os Setores</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="da-filter">
          <label for="da-min-years">Mínimo de Anos</label>
          <input type="number" id="da-min-years" placeholder="Ex: 50" min="0" step="1" />
        </div>
        <div class="da-filter">
          <label for="da-sort">Ordenar por</label>
          <select id="da-sort">
            <option value="years">Anos de Aumento (maior)</option>
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="da-view-toggle" role="tablist">
        <button class="da-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="da-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="da-results" class="da-results"></div>

      <section class="da-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="da-breakdown-grid">${breakdownHtml}</div>
      </section>

      <aside class="da-info">
        <strong>💡 O que são Dividend Aristocrats?</strong> são empresas do S&amp;P 500 que
        aumentaram os seus dividendos por pelo menos 25 anos consecutivos. Este histórico indica
        resiliência do negócio, geração de caixa consistente e compromisso da administração com os
        acionistas. Os valores de anos apresentados são os da lista de origem e podem ser
        atualizados periodicamente.
      </aside>
    </div>
  `;

  const resultsEl = container.querySelector('#da-results');
  const searchEl = container.querySelector('#da-search');
  const sectorEl = container.querySelector('#da-sector');
  const minYearsEl = container.querySelector('#da-min-years');
  const sortEl = container.querySelector('#da-sort');

  const render = () => {
    const filtered = sortDividendAristocrats(
      filterDividendAristocrats(DIVIDEND_ARISTOCRATS, {
        search: state.search,
        sector: state.sector,
        minYears: state.minYears,
      }),
      state.sortBy
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="da-empty">Nenhuma empresa encontrada.</p>';
      return;
    }

    if (state.view === 'cards') {
      resultsEl.innerHTML = renderAristocratCards(filtered);
      return;
    }

    resultsEl.innerHTML = renderAristocratTable(filtered);
    resultsEl.querySelectorAll('.da-table th[data-sort]').forEach((th) => {
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

  if (minYearsEl) {
    minYearsEl.addEventListener('input', () => {
      state.minYears = Number(minYearsEl.value) || 0;
      render();
    });
  }

  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sortBy = sortEl.value;
      render();
    });
  }

  container.querySelectorAll('.da-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.getAttribute('data-view');
      container.querySelectorAll('.da-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
}
