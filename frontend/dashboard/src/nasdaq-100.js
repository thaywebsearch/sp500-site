// ========== NASDAQ-100 MODULE ==========

import { escapeHtml } from './utils.js';

import dados from './data/nasdaq-100.json';

export const NASDAQ_100 = dados.items;

const SECTOR_COLORS = {
  Technology: '#00d4ff',
  'Communication Services': '#00d4ff',
  'Consumer Discretionary': '#ffab00',
  'Consumer Staples': '#00e676',
  'Health Care': '#29b6f6',
  Industrials: '#ffa726',
  Materials: '#66bb6a',
  Energy: '#ff5252',
  Utilities: '#42a5f5',
  Financials: '#ba68c8',
  'Real Estate': '#ec407a',
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

export function getNasdaqSectorClass(sector) {
  return `nq-sector--${sectorSlug(sector)}`;
}

export function formatCap(billions) {
  const value = Number(billions) || 0;
  return value >= 1000 ? `$${(value / 1000).toFixed(2)}T` : `$${value.toFixed(1)}B`;
}

export function totalMarketCap(list) {
  return (list || []).reduce((sum, c) => sum + (Number(c.cap) || 0), 0);
}

export function totalWeight(list) {
  return (list || []).reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
}

export function filterNasdaq100(list, { search = '', sector = '', category = '' } = {}) {
  const term = String(search).toLowerCase().trim();
  return (list || []).filter((c) => {
    const matchesSearch =
      !term ||
      String(c.company).toLowerCase().includes(term) ||
      String(c.ticker).toLowerCase().includes(term);
    const matchesSector = !sector || c.sector === sector;
    const matchesCategory = !category || c.category === category;
    return matchesSearch && matchesSector && matchesCategory;
  });
}

export function sortNasdaq100(list, sortBy = 'rank') {
  return [...(list || [])].sort((a, b) => {
    switch (sortBy) {
      case 'cap':
        return (b.cap || 0) - (a.cap || 0);
      case 'weight':
        return (b.weight || 0) - (a.weight || 0) || (a.rank || 0) - (b.rank || 0);
      case 'company':
        return a.company.localeCompare(b.company);
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      case 'sector':
        return a.sector.localeCompare(b.sector) || (a.rank || 0) - (b.rank || 0);
      case 'rank':
      default:
        return (a.rank || 0) - (b.rank || 0);
    }
  });
}

export function nasdaqSectorOptions(list) {
  return [...new Set((list || []).map((c) => c.sector))].sort();
}

export function nasdaqBreakdown(list) {
  const groups = new Map();
  (list || []).forEach((c) => {
    if (!groups.has(c.sector)) groups.set(c.sector, []);
    groups.get(c.sector).push(c);
  });
  return [...groups.entries()]
    .map(([sector, companies]) => ({
      sector,
      companies: companies.map((c) => c.ticker),
      count: companies.length,
      weight: companies.reduce((sum, c) => sum + (Number(c.weight) || 0), 0),
    }))
    .sort((a, b) => b.count - a.count || a.sector.localeCompare(b.sector));
}

export function renderNasdaqCards(list) {
  const cards = (list || [])
    .map(
      (c) => `
      <article class="nq-card">
        <div class="nq-card-head">
          <div>
            <span class="nq-rank">#${escapeHtml(c.rank)}</span>
            <h3>${escapeHtml(c.company)}</h3>
          </div>
          <span class="nq-ticker">${escapeHtml(c.ticker)}</span>
        </div>
        <span class="nq-sector ${getNasdaqSectorClass(c.sector)}">${escapeHtml(c.sector)}</span>
        <div class="nq-metrics">
          <div class="nq-metric">
            <span class="nq-metric-value">${formatCap(c.cap)}</span>
            <span class="nq-metric-label">Market Cap</span>
          </div>
          <div class="nq-metric">
            <span class="nq-metric-value">${(Number(c.weight) || 0).toFixed(2)}%</span>
            <span class="nq-metric-label">Peso no Índice</span>
          </div>
        </div>
        <span class="nq-cat">${escapeHtml(c.category)} · ${escapeHtml(c.concentration)}</span>
      </article>`
    )
    .join('');
  return `<div class="nq-cards">${cards}</div>`;
}

export function renderNasdaqTable(list) {
  const rows = (list || [])
    .map(
      (c) => `
      <tr>
        <td>${escapeHtml(c.rank)}</td>
        <td><strong>${escapeHtml(c.company)}</strong></td>
        <td><span class="nq-ticker">${escapeHtml(c.ticker)}</span></td>
        <td><span class="nq-sector ${getNasdaqSectorClass(c.sector)}">${escapeHtml(c.sector)}</span></td>
        <td>${formatCap(c.cap)}</td>
        <td><strong class="nq-weight">${(Number(c.weight) || 0).toFixed(2)}%</strong></td>
        <td>${(Number(c.cumulative) || 0).toFixed(2)}%</td>
        <td><span class="nq-cat">${escapeHtml(c.category)}</span></td>
      </tr>`
    )
    .join('');
  return `
    <div class="nq-table-wrapper">
      <table class="nq-table">
        <thead>
          <tr>
            <th data-sort="rank">#</th>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
            <th data-sort="cap">Market Cap</th>
            <th data-sort="weight">Peso (%)</th>
            <th>Peso Acumulado (%)</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function renderNasdaq100(containerId = 'nasdaq-100-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const state = { search: '', sector: '', category: '', sortBy: 'rank', view: 'cards' };

  const optionsHtml = nasdaqSectorOptions(NASDAQ_100)
    .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
    .join('');

  const breakdownHtml = nasdaqBreakdown(NASDAQ_100)
    .map(
      (group) => `
      <div class="nq-breakdown-item">
        <div class="nq-breakdown-head" style="color: ${sectorColor(group.sector)}">
          <span>${escapeHtml(group.sector)}</span>
          <span class="nq-breakdown-count">${group.count} · ${group.weight.toFixed(2)}%</span>
        </div>
        <p class="nq-breakdown-list">${group.companies.map((c) => escapeHtml(c)).join(', ')}</p>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <div class="nasdaq-view">
      <header class="nq-header">
        <div class="nq-header-content">
          <h2>Nasdaq-100</h2>
          <p>💻 100 maiores empresas não financeiras da Nasdaq · Snapshot 01/05/2026</p>
        </div>
        <div class="nq-stats">
          <div class="nq-stat">
            <span class="nq-stat-value">${NASDAQ_100.length}</span>
            <span class="nq-stat-label">Empresas</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${formatCap(totalMarketCap(NASDAQ_100))}</span>
            <span class="nq-stat-label">Market Cap Total</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${totalWeight(NASDAQ_100).toFixed(2)}%</span>
            <span class="nq-stat-label">Peso no Índice</span>
          </div>
        </div>
      </header>

      <div class="nq-filters">
        <div class="nq-filter">
          <label for="nq-search">Buscar</label>
          <input type="text" id="nq-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="nq-filter">
          <label for="nq-sector">Setor</label>
          <select id="nq-sector">
            <option value="">Todos os Setores</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="nq-filter">
          <label for="nq-cap">Categoria de Capitalização</label>
          <select id="nq-cap">
            <option value="">Todas</option>
            <option value="Mega Cap">Mega Cap</option>
            <option value="Large Cap">Large Cap</option>
          </select>
        </div>
        <div class="nq-filter">
          <label for="nq-sort">Ordenar por</label>
          <select id="nq-sort">
            <option value="rank">Ranking (1º → 100º)</option>
            <option value="cap">Market Cap (maior)</option>
            <option value="weight">Peso (maior)</option>
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="nq-view-toggle" role="tablist">
        <button class="nq-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="nq-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="nq-results" class="nq-results"></div>

      <section class="nq-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="nq-breakdown-grid">${breakdownHtml}</div>
      </section>

      <aside class="nq-info">
        <strong>💡 Sobre o Nasdaq-100:</strong> o índice reúne as 100 maiores empresas não
        financeiras negociadas na Nasdaq, ponderadas por capitalização de mercado. Como o peso é
        concentrado, as dez primeiras empresas respondem por cerca de dois terços do índice. Os
        dados correspondem ao snapshot de 01/05/2026 e devem ser atualizados periodicamente.
      </aside>
    </div>
  `;

  const resultsEl = container.querySelector('#nq-results');
  const searchEl = container.querySelector('#nq-search');
  const sectorEl = container.querySelector('#nq-sector');
  const capEl = container.querySelector('#nq-cap');
  const sortEl = container.querySelector('#nq-sort');

  const render = () => {
    const filtered = sortNasdaq100(
      filterNasdaq100(NASDAQ_100, {
        search: state.search,
        sector: state.sector,
        category: state.category,
      }),
      state.sortBy
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="nq-empty">Nenhuma empresa encontrada.</p>';
      return;
    }

    if (state.view === 'cards') {
      resultsEl.innerHTML = renderNasdaqCards(filtered);
      return;
    }

    resultsEl.innerHTML = renderNasdaqTable(filtered);
    resultsEl.querySelectorAll('.nq-table th[data-sort]').forEach((th) => {
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

  if (capEl) {
    capEl.addEventListener('change', () => {
      state.category = capEl.value;
      render();
    });
  }

  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sortBy = sortEl.value;
      render();
    });
  }

  container.querySelectorAll('.nq-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.getAttribute('data-view');
      container.querySelectorAll('.nq-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
}
