// ========== CONFIGURAÇÃO ==========
import { SECTORS } from './config.js';
import { getAllSectorData, getDailySummary } from './api.js';
import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { loadBubbleChart } from './bubble-chart.js';
import { openPriceChart } from './price-chart.js';
import { openCompanyDetails } from './company-details.js';
import {
  formatMarketCap,
  escapeHtml,
  debounce,
  getCountry,
  filterCompanies,
  sortCompanies,
} from './utils.js';

// ========== VARIÁVEIS GLOBAIS ==========
let allCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
let currentTab = 'dashboard';
const PAGE_SIZE = 50;
let selectedRows = new Set();

// ========== ELEMENTOS DO DOM ==========
let sectorFilter,
  countryFilter,
  searchInput,
  dividendMinInput,
  sortSelect,
  tableBody,
  statsEl,
  paginationEl,
  headerCheckbox;

// ========== TEMA (DARK / LIGHT) ==========
function initTheme() {
  const storedTheme = localStorage.getItem('sp500-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = storedTheme || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.textContent = theme === 'light' ? '🌙' : '☀️';
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sp500-theme', next);
    toggle.textContent = next === 'light' ? '🌙' : '☀️';
  });
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Elementos do dashboard
  sectorFilter = document.getElementById('sector-filter');
  countryFilter = document.getElementById('country-filter');
  searchInput = document.getElementById('search-input');
  dividendMinInput = document.getElementById('dividend-min');
  sortSelect = document.getElementById('sort-select');
  tableBody = document.getElementById('table-body');
  statsEl = document.getElementById('stats');
  paginationEl = document.getElementById('pagination');
  headerCheckbox = document.getElementById('header-checkbox');

  // Event listeners para navegação
  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      setActiveTab(e.target.dataset.tab);
    });
  });

  // Event listeners do dashboard
  if (sectorFilter) sectorFilter.addEventListener('change', applyFilters);
  if (countryFilter) countryFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
  if (dividendMinInput) dividendMinInput.addEventListener('input', debounce(applyFilters, 300));
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  if (headerCheckbox) {
    headerCheckbox.addEventListener('change', () => {
      const visibleCheckboxes = tableBody.querySelectorAll('.row-checkbox');
      visibleCheckboxes.forEach((cb) => {
        cb.checked = headerCheckbox.checked;
        cb.dispatchEvent(new Event('change'));
      });
    });
  }

  const selectAllBtn = document.getElementById('select-all');
  const deselectAllBtn = document.getElementById('deselect-all');
  const exportCsvBtn = document.getElementById('export-csv');
  const exportJsonBtn = document.getElementById('export-json');

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      filteredCompanies.forEach((c) => selectedRows.add(c.symbol));
      renderTable();
      updateStats();
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      selectedRows.clear();
      renderTable();
      updateStats();
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportCSV);
  }

  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', exportJSON);
  }

  // Inicializa
  updateUI();
  updateTabButtons();
  loadDashboardData();
});

// ========== NAVEGAÇÃO DE ABAS ==========
function setActiveTab(tab) {
  currentTab = tab;
  updateUI();
  updateTabButtons();
}

function updateUI() {
  const dashboardView = document.getElementById('dashboard-view');
  const treemapView = document.getElementById('treemap-view');
  const heatmapView = document.getElementById('heatmap-view');
  const bubbleChartView = document.getElementById('bubble-chart-view');

  if (dashboardView) dashboardView.style.display = 'none';
  if (treemapView) treemapView.style.display = 'none';
  if (heatmapView) heatmapView.style.display = 'none';
  if (bubbleChartView) bubbleChartView.style.display = 'none';

  if (currentTab === 'dashboard') {
    if (dashboardView) dashboardView.style.display = 'block';
  } else if (currentTab === 'treemap') {
    if (treemapView) treemapView.style.display = 'block';
    loadTreemap();
  } else if (currentTab === 'heatmap') {
    if (heatmapView) heatmapView.style.display = 'block';
    loadHeatmap();
  } else if (currentTab === 'bubble') {
    if (bubbleChartView) bubbleChartView.style.display = 'block';
    loadBubbleChart();
  }
}

function updateTabButtons() {
  const buttons = document.querySelectorAll('.nav-tab');
  buttons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === currentTab) {
      btn.classList.add('active');
    }
  });
}

// ========== CARREGAMENTO DE DADOS DO DASHBOARD ==========
async function loadDashboardData() {
  if (statsEl) statsEl.textContent = 'Carregando dados...';

  try {
    const setoresData = await getAllSectorData();
    allCompanies = setoresData.flatMap((s) => s.companies);

    const badge = document.getElementById('freshness-badge');
    if (badge) renderFreshnessBadge(badge, newestUpdate(setoresData));

    populateSectorFilter();
    populateCountryFilter();
    applyFilters();
    updateStats();
    loadDailySummary();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (statsEl) statsEl.textContent = 'Erro ao carregar dados. Tente novamente.';

    const badge = document.getElementById('freshness-badge');
    if (badge) renderFreshnessBadge(badge, null);
  }
}

// ========== RESUMO DO DIA ==========
const MOOD_LABEL = {
  bullish: { label: '🚀 Otimista', cls: 'mood-up' },
  bearish: { label: '⚠️ Pessimista', cls: 'mood-down' },
  neutral: { label: '➖ Neutro', cls: 'mood-flat' },
};

function formatSummaryDate(iso) {
  const parts = String(iso || '').split('-');
  if (parts.length < 3) return iso || '';
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatChangePct(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

function renderSummaryItem(mover) {
  return `
    <div class="summary-row">
      <span class="mini-symbol">${escapeHtml(mover.symbol)}</span>
      <button class="mini-name" data-symbol="${escapeHtml(mover.symbol)}" title="Ver detalhes">${escapeHtml(mover.name)}</button>
      <strong class="mini-change ${mover.changePct >= 0 ? 'positive' : 'negative'}">${formatChangePct(mover.changePct)}</strong>
    </div>
  `;
}

function renderDailySummary(dados) {
  const mood = MOOD_LABEL[dados.marketMood] || MOOD_LABEL.neutral;
  const stats = dados.stats || {};
  const gainers = dados.topGainers || [];
  const losers = dados.topLosers || [];
  const sectors = dados.sectorPerformance || [];
  const updatedTime = dados.generatedAt ? dados.generatedAt.split(' ')[1] : '';

  return `
    <div class="summary-head">
      <div>
        <h2 class="summary-title">🔄 Resumo do Dia</h2>
        <span class="summary-date">Pregão de ${formatSummaryDate(dados.referenceDate)} · Atualizado às ${updatedTime} UTC</span>
      </div>
      <span class="summary-mood ${mood.cls}">${mood.label}</span>
    </div>
    <div class="summary-stats">
      <span class="summary-stat"><strong class="positive">▲ ${stats.gainers ?? 0}</strong> altas</span>
      <span class="summary-stat"><strong class="negative">▼ ${stats.losers ?? 0}</strong> baixas</span>
      <span class="summary-stat"><strong>➖ ${stats.neutral ?? 0}</strong> neutras</span>
      <span class="summary-stat"><strong>${stats.total ?? 0}</strong> empresas</span>
    </div>
    <div class="summary-grid">
      <div class="summary-list">
        <h3 class="summary-list-title positive">▲ Maiores Altas</h3>
        ${gainers.length ? gainers.map(renderSummaryItem).join('') : '<p class="summary-empty">Sem dados</p>'}
      </div>
      <div class="summary-list">
        <h3 class="summary-list-title negative">▼ Maiores Baixas</h3>
        ${losers.length ? losers.map(renderSummaryItem).join('') : '<p class="summary-empty">Sem dados</p>'}
      </div>
    </div>
    <div class="summary-sectors">
      ${sectors
        .map(
          (s) => `
        <span class="sector-chip ${s.avgChangePct >= 0 ? 'chip-up' : 'chip-down'}">
          <span class="sector-chip-name">${escapeHtml(s.name)}</span>
          <strong>${formatChangePct(s.avgChangePct)}</strong>
        </span>`
        )
        .join('')}
    </div>
  `;
}

async function loadDailySummary() {
  const container = document.getElementById('daily-summary');
  if (!container) return;

  try {
    const dados = await getDailySummary();
    if (!dados) throw new Error('Sem dados');
    container.style.display = '';
    container.innerHTML = renderDailySummary(dados);

    container.querySelectorAll('.mini-name').forEach((btn) => {
      btn.addEventListener('click', () => {
        const company = allCompanies.find((c) => c.symbol === btn.dataset.symbol);
        if (company) openCompanyDetails(company);
      });
    });
  } catch (error) {
    console.error('Resumo do dia indisponível:', error);
    container.style.display = 'none';
  }
}

// ========== ÚLTIMA ATUALIZAÇÃO VISÍVEL ==========
const DAY_MS = 86400000;

function parseTimestamp(value) {
  if (!value) return null;
  const text = String(value).trim();
  const date = text.length === 10 ? new Date(`${text}T00:00:00Z`) : new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function newestUpdate(setoresData) {
  let latest = null;
  setoresData.forEach((sector) => {
    const ts = parseTimestamp(sector.lastUpdated);
    if (ts && (!latest || ts > latest)) latest = ts;
  });
  return latest;
}

function formatFreshness(ms, now) {
  const diffMin = Math.floor(Math.max(0, now - ms) / 60000);
  if (diffMin < 1) return 'atualizado agora';
  if (diffMin < 60) return `atualizado há ${diffMin} min`;

  const hour = new Date(ms).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const diffDays = Math.floor(diffMin / 1440);
  if (diffDays < 1) return `atualizado hoje às ${hour}`;
  if (diffDays < 2) return `atualizado ontem às ${hour}`;

  const date = new Date(ms).toLocaleDateString('pt-BR');
  return diffDays >= 8
    ? `desatualizado há ${diffDays} dias (${date})`
    : `atualizado há ${diffDays} dias (${date})`;
}

function renderFreshnessBadge(badge, latest) {
  const text = badge.querySelector('#freshness-text');

  if (!latest) {
    badge.className = 'freshness-badge fd-unknown';
    text.textContent = 'sem dados de atualização';
    badge.title = 'Sem registro de atualização dos dados';
    return;
  }

  const ageDays = (Date.now() - latest) / DAY_MS;
  badge.className = 'freshness-badge ';
  if (ageDays < 2) {
    badge.classList.add('fd-fresh');
  } else if (ageDays <= 7) {
    badge.classList.add('fd-aging');
  } else {
    badge.classList.add('fd-stale');
  }

  text.textContent = formatFreshness(latest, Date.now());
  badge.title = `Última atualização dos dados: ${new Date(latest).toLocaleString('pt-BR')}`;
}

// ========== FILTROS E BUSCA ==========
function populateSectorFilter() {
  if (!sectorFilter) return;

  sectorFilter.innerHTML = '<option value="">Todos os Setores</option>';
  SECTORS.forEach((sector) => {
    const option = document.createElement('option');
    option.value = sector.id;
    option.textContent = sector.name;
    sectorFilter.appendChild(option);
  });
}

function populateCountryFilter() {
  if (!countryFilter) return;

  const countries = [...new Set(allCompanies.map((c) => getCountry(c.headquarters)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  countryFilter.innerHTML = '<option value="">Todos os Países</option>';
  countries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryFilter.appendChild(option);
  });
}

function applyFilters() {
  const sectorValue = sectorFilter?.value || '';
  const countryValue = countryFilter?.value || '';
  const searchValue = searchInput?.value || '';
  const dividendValue = dividendMinInput?.value || '';
  const sortValue = sortSelect?.value || 'symbol-asc';

  const result = sortCompanies(
    filterCompanies(allCompanies, {
      sector: sectorValue,
      country: countryValue,
      search: searchValue,
      dividendMin: dividendValue,
    }),
    sortValue
  );

  filteredCompanies = result;
  currentPage = 1;
  selectedRows.clear();
  if (headerCheckbox) headerCheckbox.checked = false;
  renderTable();
  renderPagination();
  updateStats();
}

// ========== RENDERIZAÇÃO DA TABELA ==========
function renderTable() {
  if (!tableBody) return;

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageCompanies = filteredCompanies.slice(start, end);

  if (pageCompanies.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="table-message" style="color: var(--text-secondary);">
          Nenhuma empresa encontrada
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = pageCompanies
    .map((company, index) => {
      const globalIndex = start + index + 1;
      const isSelected = selectedRows.has(company.symbol);
      const marketCap = formatMarketCap(company.marketCap);
      const dividendYield =
        company.dividendYield !== null && company.dividendYield !== undefined
          ? `${company.dividendYield.toFixed(2)}%`
          : '—';
      const dividendClass =
        company.dividendYield !== null && company.dividendYield !== undefined ? 'positive' : 'none';

      return `
      <tr data-symbol="${company.symbol}" class="${isSelected ? 'selected' : ''}">
        <td><input type="checkbox" class="row-checkbox" ${isSelected ? 'checked' : ''}></td>
        <td>${globalIndex}</td>
        <td class="symbol">${company.symbol}</td>
        <td class="company-name" title="Ver detalhes">${escapeHtml(company.name)}</td>
        <td>${escapeHtml(company.sectorName)}</td>
        <td class="market-cap">${marketCap}</td>
        <td>${escapeHtml(company.subIndustry || 'N/A')}</td>
        <td>${escapeHtml(company.headquarters || 'N/A')}</td>
        <td class="dividend ${dividendClass}">${dividendYield}</td>
        <td><button class="price-btn" data-symbol="${company.symbol}" data-name="${escapeHtml(company.name)}" title="Ver histórico de preços">📈</button></td>
      </tr>
    `;
    })
    .join('');

  attachRowListeners();
  attachPriceButtons();
  updateHeaderCheckbox();
}

function attachPriceButtons() {
  if (!tableBody) return;
  tableBody.querySelectorAll('.price-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPriceChart(btn.dataset.symbol, btn.dataset.name);
    });
  });
}

function attachRowListeners() {
  if (!tableBody) return;

  tableBody.querySelectorAll('.row-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      const symbol = row.dataset.symbol;
      if (e.target.checked) {
        selectedRows.add(symbol);
        row.classList.add('selected');
      } else {
        selectedRows.delete(symbol);
        row.classList.remove('selected');
      }
      updateHeaderCheckbox();
    });
  });

  tableBody.querySelectorAll('tr[data-symbol]').forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') return;
      if (e.target.closest('.price-btn')) return;
      if (e.target.closest('.company-name')) return;
      const checkbox = row.querySelector('.row-checkbox');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    });
  });

  tableBody.querySelectorAll('.company-name').forEach((cell) => {
    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      const symbol = cell.closest('tr')?.dataset.symbol;
      if (!symbol) return;
      const company =
        filteredCompanies.find((c) => c.symbol === symbol) ||
        allCompanies.find((c) => c.symbol === symbol);
      if (company) openCompanyDetails(company);
    });
  });
}

function updateHeaderCheckbox() {
  if (!headerCheckbox || !tableBody) return;

  const visibleCheckboxes = tableBody.querySelectorAll('.row-checkbox');
  const checkedCount = tableBody.querySelectorAll('.row-checkbox:checked').length;

  if (checkedCount === 0) {
    headerCheckbox.indeterminate = false;
    headerCheckbox.checked = false;
  } else if (checkedCount === visibleCheckboxes.length) {
    headerCheckbox.indeterminate = false;
    headerCheckbox.checked = true;
  } else {
    headerCheckbox.indeterminate = true;
  }
}

// ========== PAGINAÇÃO ==========
function renderPagination() {
  if (!paginationEl) return;

  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>« Anterior</button>`;

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    html += `<button data-page="1">1</button>`;
    if (startPage > 2) html += `<span class="ellipsis">…</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="ellipsis">…</span>`;
    html += `<button data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Próxima »</button>`;
  html += `<span class="pagination-info">Página ${currentPage} de ${totalPages} (${filteredCompanies.length} empresas)</span>`;

  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('button[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderTable();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('next-page')?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ========== ESTATÍSTICAS ==========
function updateStats() {
  if (!statsEl) return;

  const total = allCompanies.length;
  const filtered = filteredCompanies.length;
  const selected = selectedRows.size;

  if (filtered === total) {
    statsEl.textContent = `${total} empresas no total`;
  } else {
    statsEl.textContent = `${filtered} de ${total} empresas | ${selected} selecionada(s)`;
  }
}

// ========== EXPORTAR DADOS ==========
function getSelectedCompanies() {
  return allCompanies.filter((c) => selectedRows.has(c.symbol));
}

function exportCSV() {
  const companies = getSelectedCompanies();
  if (companies.length === 0) {
    alert('Nenhuma empresa selecionada');
    return;
  }

  const headers = [
    'Símbolo',
    'Empresa',
    'Setor',
    'Subindústria',
    'Sede',
    'Market Cap',
    'Dividend Yield',
    'Data Inclusão',
    'CIK',
    'Fundação',
  ];
  const rows = companies.map((c) => [
    c.symbol,
    `"${c.name}"`,
    c.sectorName,
    `"${c.subIndustry || ''}"`,
    `"${c.headquarters || ''}"`,
    c.marketCap || '',
    c.dividendYield !== null && c.dividendYield !== undefined ? c.dividendYield.toFixed(2) : '',
    c.dateAdded || '',
    c.cik || '',
    c.founded || '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, 'sp500-selecao.csv', 'text/csv');
}

function exportJSON() {
  const companies = getSelectedCompanies();
  if (companies.length === 0) {
    alert('Nenhuma empresa selecionada');
    return;
  }

  const json = JSON.stringify(companies, null, 2);
  downloadFile(json, 'sp500-selecao.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
