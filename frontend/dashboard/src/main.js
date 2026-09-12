// ========== CONFIGURAÇÃO ==========
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://sp500-site-production.up.railway.app';

const SECTORS = [
  { id: 'communication-services', name: 'Communication Services' },
  { id: 'consumer-discretionary', name: 'Consumer Discretionary' },
  { id: 'consumer-staples', name: 'Consumer Staples' },
  { id: 'energy', name: 'Energy' },
  { id: 'financials', name: 'Financials' },
  { id: 'health-care', name: 'Health Care' },
  { id: 'industrials', name: 'Industrials' },
  { id: 'information-technology', name: 'Information Technology' },
  { id: 'materials', name: 'Materials' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'utilities', name: 'Utilities' },
];

// ========== VARIÁVEIS GLOBAIS ==========
let allCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
let currentTab = 'dashboard';
const PAGE_SIZE = 50;
let selectedRows = new Set();

// ========== ELEMENTOS DO DOM ==========
let sectorFilter, searchInput, sortSelect, tableBody, statsEl, paginationEl, headerCheckbox;

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do dashboard
  sectorFilter = document.getElementById('sector-filter');
  searchInput = document.getElementById('search-input');
  sortSelect = document.getElementById('sort-select');
  tableBody = document.getElementById('table-body');
  statsEl = document.getElementById('stats');
  paginationEl = document.getElementById('pagination');
  headerCheckbox = document.getElementById('header-checkbox');

  // Event listeners para navegação
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setActiveTab(e.target.dataset.tab);
    });
  });

  // Event listeners do dashboard
  if (sectorFilter) sectorFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  if (headerCheckbox) {
    headerCheckbox.addEventListener('change', () => {
      const visibleCheckboxes = tableBody.querySelectorAll('.row-checkbox');
      visibleCheckboxes.forEach(cb => {
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
      filteredCompanies.forEach(c => selectedRows.add(c.symbol));
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
  buttons.forEach(btn => {
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
    const setoresResponse = await fetch(`${API_BASE_URL}/api/setores`);
    if (!setoresResponse.ok) throw new Error('Erro ao buscar setores');
    const setoresData = await setoresResponse.json();
    const setores = setoresData.setores || [];

    const promises = setores.map(async (setorId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/setor/${setorId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const sector = SECTORS.find(s => s.id === setorId);
        const sectorName = sector ? sector.name : setorId;

        if (data.dados && data.dados.companies && Array.isArray(data.dados.companies)) {
          return data.dados.companies.map(c => ({
            ...c,
            sector: setorId,
            sectorName: sectorName
          }));
        }
        return [];
      } catch (e) {
        console.error(`Erro ao carregar ${setorId}:`, e);
        return [];
      }
    });

    const results = await Promise.all(promises);
    allCompanies = results.flat();

    populateSectorFilter();
    applyFilters();
    updateStats();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (statsEl) statsEl.textContent = 'Erro ao carregar dados. Tente novamente.';
  }
}

// ========== FILTROS E BUSCA ==========
function populateSectorFilter() {
  if (!sectorFilter) return;
  
  sectorFilter.innerHTML = '<option value="">Todos os Setores</option>';
  SECTORS.forEach(sector => {
    const option = document.createElement('option');
    option.value = sector.id;
    option.textContent = sector.name;
    sectorFilter.appendChild(option);
  });
}

function applyFilters() {
  let result = [...allCompanies];

  const sectorValue = sectorFilter?.value || '';
  if (sectorValue) {
    result = result.filter(c => c.sector === sectorValue);
  }

  const searchValue = searchInput?.value?.toLowerCase().trim() || '';
  if (searchValue) {
    result = result.filter(c =>
      c.symbol.toLowerCase().includes(searchValue) ||
      c.name.toLowerCase().includes(searchValue) ||
      (c.subIndustry && c.subIndustry.toLowerCase().includes(searchValue)) ||
      (c.headquarters && c.headquarters.toLowerCase().includes(searchValue))
    );
  }

  const sortValue = sortSelect?.value || 'symbol-asc';
  result.sort((a, b) => {
    switch (sortValue) {
      case 'marketCap-desc':
        return (b.marketCap || 0) - (a.marketCap || 0);
      case 'marketCap-asc':
        return (a.marketCap || 0) - (b.marketCap || 0);
      case 'symbol-asc':
        return a.symbol.localeCompare(b.symbol);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'dividendYield-desc':
        return (b.dividendYield || 0) - (a.dividendYield || 0);
      default:
        return 0;
    }
  });

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
        <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          Nenhuma empresa encontrada
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = pageCompanies.map((company, index) => {
    const globalIndex = start + index + 1;
    const isSelected = selectedRows.has(company.symbol);
    const marketCap = formatMarketCap(company.marketCap);
    const dividendYield = company.dividendYield !== null && company.dividendYield !== undefined
      ? `${company.dividendYield.toFixed(2)}%`
      : '—';
    const dividendClass = company.dividendYield !== null && company.dividendYield !== undefined ? 'positive' : 'none';

    return `
      <tr data-symbol="${company.symbol}" class="${isSelected ? 'selected' : ''}">
        <td><input type="checkbox" class="row-checkbox" ${isSelected ? 'checked' : ''}></td>
        <td>${globalIndex}</td>
        <td class="symbol">${company.symbol}</td>
        <td>${escapeHtml(company.name)}</td>
        <td>${escapeHtml(company.sectorName)}</td>
        <td class="market-cap">${marketCap}</td>
        <td>${escapeHtml(company.subIndustry || 'N/A')}</td>
        <td>${escapeHtml(company.headquarters || 'N/A')}</td>
        <td class="dividend ${dividendClass}">${dividendYield}</td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
  updateHeaderCheckbox();
}

function attachRowListeners() {
  if (!tableBody) return;

  tableBody.querySelectorAll('.row-checkbox').forEach(checkbox => {
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

  tableBody.querySelectorAll('tr[data-symbol]').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') return;
      const checkbox = row.querySelector('.row-checkbox');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
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

  paginationEl.querySelectorAll('button[data-page]').forEach(btn => {
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
  return allCompanies.filter(c => selectedRows.has(c.symbol));
}

function exportCSV() {
  const companies = getSelectedCompanies();
  if (companies.length === 0) {
    alert('Nenhuma empresa selecionada');
    return;
  }

  const headers = ['Símbolo', 'Empresa', 'Setor', 'Subindústria', 'Sede', 'Market Cap', 'Dividend Yield', 'Data Inclusão', 'CIK', 'Fundação'];
  const rows = companies.map(c => [
    c.symbol,
    `"${c.name}"`,
    c.sectorName,
    `"${c.subIndustry || ''}"`,
    `"${c.headquarters || ''}"`,
    c.marketCap || '',
    c.dividendYield !== null && c.dividendYield !== undefined ? c.dividendYield.toFixed(2) : '',
    c.dateAdded || '',
    c.cik || '',
    c.founded || ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
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

// ========== UTILIDADES ==========
function formatMarketCap(marketCap) {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString()}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}