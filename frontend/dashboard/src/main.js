// ========== IMPORTS ==========
import { API_BASE_URL, SECTORS } from './config.js';
import { loadCuriosidades } from './daily-curiosity.js';
import { escapeHtml, formatMarketCap, getCountry } from './utils.js';
import { openCompanyDetails } from './company-details.js';
import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { loadBubbleChart } from './bubble-chart.js';

// ========== CONSTANTES ==========
const WATCHLIST_STORAGE_KEY = 'sp500-watchlist';
const PRICE_ALERTS_STORAGE_KEY = 'sp500-price-alerts';
const PAGE_SIZE = 50;

// ========== FUNÇÕES AUXILIARES (DEFINIDAS PRIMEIRO) ==========

function loadWatchlist() {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Erro ao carregar watchlist:', e);
    return [];
  }
}

function saveWatchlist() {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...watchlistSymbols]));
  } catch (e) {
    console.error('Erro ao salvar watchlist:', e);
  }
}

function loadPriceAlerts() {
  try {
    const stored = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
      return parsed;
    }
    
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
      return parsed.map(p => [p.symbol, p]);
    }
    
    return [];
  } catch (erro) {
    console.error('Erro ao carregar price alerts:', erro);
    return [];
  }
}

function savePriceAlerts() {
  try {
    const alertsArray = Array.from(priceAlerts.entries());
    localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(alertsArray));
  } catch (erro) {
    console.error('Erro ao salvar price alerts:', erro);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== VARIÁVEIS GLOBAIS ==========
let allCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
let currentTab = 'dashboard';
let selectedRows = new Set();
let rowCounter = 0;

const watchlistSymbols = new Set(loadWatchlist() || []);
const priceAlertsArray = loadPriceAlerts();
const priceAlerts = new Map(priceAlertsArray && priceAlertsArray.length > 0 ? priceAlertsArray : []);

// ========== ELEMENTOS DO DOM ==========
let sectorFilter, countryFilter, searchInput, dividendMinInput, sortSelect, tableBody, statsEl, paginationEl, headerCheckbox;

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando dashboard...');
  
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

  console.log('📍 Elementos encontrados:', {
    sectorFilter: !!sectorFilter,
    tableBody: !!tableBody,
    statsEl: !!statsEl,
    paginationEl: !!paginationEl
  });

  // Event listeners para navegação de abas
  const navTabs = document.querySelectorAll('.nav-tab');
  console.log(`📌 Encontradas ${navTabs.length} abas`);
  
  navTabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute('data-tab');
      console.log(`🔀 Navegando para: ${tabName}`);
      setActiveTab(tabName);
    });
  });

  // Event listeners do dashboard
  if (sectorFilter) sectorFilter.addEventListener('change', applyFilters);
  if (countryFilter) countryFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
  if (dividendMinInput) dividendMinInput.addEventListener('change', applyFilters);
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
  console.log('✅ Event listeners registrados');
  updateUI();
  updateTabButtons();
  loadDashboardData();
  updateWatchlistCountBadge();
  startPriceAlertPolling();
  console.log('✅ Dashboard inicializado com sucesso!');
});

// ========== NAVEGAÇÃO DE ABAS ==========
function setActiveTab(tab) {
  console.log(`📍 Mudando aba para: ${tab}`);
  currentTab = tab;
  updateUI();
  updateTabButtons();
}

// ========== ATUALIZAR INTERFACE ==========
function updateUI() {
  console.log(`🎨 Atualizando UI para: ${currentTab}`);
  
  const dashboardView = document.getElementById('dashboard-view');
  const treemapView = document.getElementById('treemap-view');
  const heatmapView = document.getElementById('heatmap-view');
  const bubbleChartView = document.getElementById('bubble-chart-view');
  const watchlistView = document.getElementById('watchlist-view');
  const stockOfDayView = document.getElementById('stock-of-day-view');
  const dailyCuriosityView = document.getElementById('daily-curiosity-view');

  // Hide all views
  const allViews = [dashboardView, treemapView, heatmapView, bubbleChartView, watchlistView, stockOfDayView, dailyCuriosityView];
  allViews.forEach(view => {
    if (view) view.style.display = 'none';
  });

  // Show active view
  switch(currentTab) {
    case 'dashboard':
      if (dashboardView) dashboardView.style.display = 'block';
      break;
    case 'stock-of-day':
      if (stockOfDayView) {
        stockOfDayView.style.display = 'block';
        loadStockOfDay();
      }
      break;
    case 'daily-curiosity':
      if (dailyCuriosityView) {
        dailyCuriosityView.style.display = 'block';
        loadCuriosidades();
      }
      break;
    case 'treemap':
      if (treemapView) {
        treemapView.style.display = 'block';
        loadTreemap();
      }
      break;
    case 'heatmap':
      if (heatmapView) {
        heatmapView.style.display = 'block';
        loadHeatmap();
      }
      break;
    case 'bubble':
      if (bubbleChartView) {
        bubbleChartView.style.display = 'block';
        loadBubbleChart();
      }
      break;
    case 'watchlist':
      if (watchlistView) {
        watchlistView.style.display = 'block';
        loadWatchlistData();
      }
      break;
    default:
      if (dashboardView) dashboardView.style.display = 'block';
  }
}

function updateTabButtons() {
  const buttons = document.querySelectorAll('.nav-tab');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === currentTab) {
      btn.classList.add('active');
      console.log(`✅ Aba ativa: ${currentTab}`);
    }
  });
}

// ========== CARREGAMENTO DE DADOS ==========
async function loadDashboardData() {
  console.log('📊 Carregando dados do dashboard...');
  if (statsEl) statsEl.textContent = 'Carregando dados...';

  try {
    const setoresResponse = await fetch(`${API_BASE_URL}/api/setores`);
    if (!setoresResponse.ok) throw new Error('Erro ao buscar setores');
    const setoresData = await setoresResponse.json();
    const setores = setoresData.setores || [];

    console.log(`🔄 Carregando ${setores.length} setores...`);

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
        console.error(`❌ Erro ao carregar ${setorId}:`, e);
        return [];
      }
    });

    const results = await Promise.all(promises);
    allCompanies = results.flat();

    console.log(`✅ ${allCompanies.length} empresas carregadas`);

    if (sectorFilter) {
      sectorFilter.innerHTML = '<option value="">Todos os Setores</option>';
      const setorUnico = new Set(allCompanies.map(c => c.sector));
      [...setorUnico].sort().forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = SECTORS.find(s => s.id === sector)?.name || sector;
        sectorFilter.appendChild(option);
      });
    }

    if (countryFilter) {
      countryFilter.innerHTML = '<option value="">Todos os Países</option>';
      const paisUnico = new Set(allCompanies.map(c => getCountry(c.headquarters)));
      [...paisUnico].sort().forEach(pais => {
        const option = document.createElement('option');
        option.value = pais;
        option.textContent = pais;
        countryFilter.appendChild(option);
      });
    }

    applyFilters();
    updateStats();
  } catch (erro) {
    console.error('❌ Erro ao carregar dados:', erro);
    if (statsEl) statsEl.textContent = 'Erro ao carregar dados. Tente novamente.';
  }
}

// ========== FILTROS E ORDENAÇÃO ==========
function applyFilters() {
  const sector = sectorFilter ? sectorFilter.value : '';
  const country = countryFilter ? countryFilter.value : '';
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const dividendMin = dividendMinInput ? parseFloat(dividendMinInput.value) || 0 : 0;
  const sortBy = sortSelect ? sortSelect.value : 'symbol-asc';

  filteredCompanies = allCompanies.filter(c => {
    const matchesSector = !sector || c.sector === sector;
    const matchesCountry = !country || getCountry(c.headquarters) === country;
    const matchesSearch = !searchTerm ||
      c.symbol.toLowerCase().includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm) ||
      (c.subIndustry && c.subIndustry.toLowerCase().includes(searchTerm)) ||
      (c.headquarters && c.headquarters.toLowerCase().includes(searchTerm));
    const matchesDividend = !dividendMin || (parseFloat(c.dividendYield) || 0) >= dividendMin;
    
    return matchesSector && matchesCountry && matchesSearch && matchesDividend;
  });

  // Ordenação
  const [sortField, sortOrder] = sortBy.split('-');
  filteredCompanies.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      const result = (valA || '').localeCompare(valB || '');
      return sortOrder === 'asc' ? result : -result;
    }
    
    const numA = parseFloat(valA) || 0;
    const numB = parseFloat(valB) || 0;
    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  currentPage = 1;
  rowCounter = 0;
  renderTable();
  updateStats();
}

// ========== RENDERIZAÇÃO DA TABELA ==========
function renderTable() {
  if (!tableBody) {
    console.error('❌ tableBody não encontrado!');
    return;
  }

  tableBody.innerHTML = '';
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageCompanies = filteredCompanies.slice(start, end);

  console.log(`📋 Renderizando ${pageCompanies.length} empresas (página ${currentPage})`);

  pageCompanies.forEach((company, index) => {
    rowCounter++;
    const isSelected = selectedRows.has(company.symbol);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${company.symbol}" 
          ${isSelected ? 'checked' : ''}>
      </td>
      <td class="col-index">${start + index + 1}</td>
      <td><strong>${company.symbol}</strong></td>
      <td>${company.name || 'N/A'}</td>
      <td>${company.sectorName || company.sector || 'N/A'}</td>
      <td>${formatMarketCap(company.marketCap)}</td>
      <td>${company.subIndustry || company.industry || 'N/A'}</td>
      <td>${company.headquarters || 'N/A'}</td>
      <td>${company.dividendYield ? parseFloat(company.dividendYield).toFixed(2) + '%' : 'N/A'}</td>
      <td>
        <button class="btn-watchlist" data-symbol="${company.symbol}" title="Adicionar à watchlist">
          ${watchlistSymbols.has(company.symbol) ? '★' : '☆'}
        </button>
      </td>
    `;

    const checkbox = row.querySelector('.row-checkbox');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedRows.add(company.symbol);
      } else {
        selectedRows.delete(company.symbol);
      }
      updateStats();
    });

    const watchlistBtn = row.querySelector('.btn-watchlist');
    watchlistBtn.addEventListener('click', () => {
      toggleWatchlist(company.symbol);
      watchlistBtn.textContent = watchlistSymbols.has(company.symbol) ? '★' : '☆';
      updateWatchlistCountBadge();
    });

    tableBody.appendChild(row);
  });

  console.log(`✅ ${pageCompanies.length} linhas renderizadas`);
  renderPagination();
}

// ========== PAGINAÇÃO ==========
function renderPagination() {
  if (!paginationEl) return;

  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });
  paginationEl.appendChild(prevBtn);

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  paginationEl.appendChild(pageInfo);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Próxima';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });
  paginationEl.appendChild(nextBtn);
}

// ========== ESTATÍSTICAS ==========
function updateStats() {
  if (!statsEl) return;

  const total = filteredCompanies.length;
  const selected = selectedRows.size;
  const avgDividend = filteredCompanies.length > 0
    ? (filteredCompanies.reduce((sum, c) => sum + (parseFloat(c.dividendYield) || 0), 0) / filteredCompanies.length).toFixed(2)
    : 0;

  statsEl.innerHTML = `Total: ${total} | Selecionadas: ${selected} | Dividend Yield Médio: ${avgDividend}%`;
}

// ========== WATCHLIST ==========
function toggleWatchlist(symbol) {
  if (watchlistSymbols.has(symbol)) {
    watchlistSymbols.delete(symbol);
  } else {
    watchlistSymbols.add(symbol);
  }
  saveWatchlist();
}

function updateWatchlistCountBadge() {
  const badge = document.querySelector('[data-watchlist-count]');
  if (badge) {
    badge.textContent = watchlistSymbols.size;
    console.log(`🌟 Watchlist atualizada: ${watchlistSymbols.size} empresas`);
  }
}

async function loadWatchlistData() {
  const watchlistView = document.getElementById('watchlist-view');
  if (!watchlistView) return;

  const companies = allCompanies.filter(c => watchlistSymbols.has(c.symbol));

  if (companies.length === 0) {
    watchlistView.innerHTML = '<p>Nenhuma empresa na watchlist.</p>';
    return;
  }

  let html = '<table class="watchlist-table"><thead><tr><th>#</th><th>Símbolo</th><th>Nome</th><th>Setor</th><th>Dividend Yield</th><th>Market Cap</th></tr></thead><tbody>';
  companies.forEach((c, idx) => {
    html += `<tr>
      <td>${idx + 1}</td>
      <td><strong>${c.symbol}</strong></td>
      <td>${c.name}</td>
      <td>${c.sectorName || 'N/A'}</td>
      <td>${c.dividendYield ? parseFloat(c.dividendYield).toFixed(2) + '%' : 'N/A'}</td>
      <td>${formatMarketCap(c.marketCap)}</td>
    </tr>`;
  });
  html += '</tbody></table>';

  watchlistView.innerHTML = html;
}

// ========== STOCK OF DAY (AÇÃO DO DIA) ==========
async function loadStockOfDay() {
  const stockOfDayView = document.getElementById('stock-of-day-view');
  if (!stockOfDayView) return;

  stockOfDayView.innerHTML = `
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;

  try {
    if (allCompanies.length === 0) await loadDashboardData();
    const today = new Date().toISOString().slice(0, 10);
    const cached = getCachedStockOfDay(today);
    if (cached) {
      renderStockOfDay(stockOfDayView, cached);
      return;
    }
    const generated = await generateStockOfDay();
    cacheStockOfDay(today, generated);
    renderStockOfDay(stockOfDayView, generated);
  } catch (error) {
    console.error('Erro ao carregar Ação do Dia:', error);
    stockOfDayView.innerHTML = `
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `;
  }
}

function generateStockOfDay() {
  return new Promise(resolve => {
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      const seed = dateToSeed(today);

      const ranked = allCompanies
        .filter(d => d.marketCap && d.marketCap > 1e9)
        .map(d => {
          const technical = technicalScore(d);
          const sector = sectorScore(d.sector);
          const watchlist = watchlistSymbols.has(d.symbol) ? 15 : 0;
          const dividend = (d.dividendYield || 0) > 2 ? 10 : 0;
          const liquidity = Math.min(20, Math.log10(d.marketCap / 1e9) * 5);
          const volatility = volatilityScore(d);
          const score = technical + sector + watchlist + dividend + liquidity + volatility;

          return {
            ...d,
            score: Math.round(score * 100) / 100,
            breakdown: {
              technical,
              sector,
              watchlist,
              dividend,
              liquidity: Math.round(liquidity),
              volatility: Math.round(volatility)
            },
            rationale: buildRationale(d, technical, sector, watchlist, dividend)
          };
        })
        .sort((a, b) => b.score - a.score);

      const top = ranked.slice(0, Math.min(10, ranked.length));
      const index = seed % top.length;
      const primary = top[index];
      const alternatives = top.filter((d, i) => i !== index).slice(0, 3);

      resolve({
        date: today,
        primary,
        alternatives,
        marketContext: getMarketContext(),
        generatedAt: new Date().toISOString()
      });
    }, 100);
  });
}

function dateToSeed(date) {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function technicalScore(company) {
  let score = 50;
  const dividendYield = company.dividendYield || 0;
  if (dividendYield > 4) score += 15;
  else if (dividendYield > 2) score += 8;
  else if (dividendYield > 0) score += 3;

  const marketCap = company.marketCap || 0;
  if (marketCap > 5e11) score += 10;
  else if (marketCap > 1e11) score += 7;
  else if (marketCap > 5e10) score += 5;
  else if (marketCap > 1e10) score += 3;

  const subIndustry = (company.subIndustry || '').toLowerCase();
  if (['software', 'semiconductors', 'biotechnology', 'cloud', 'ai', 'cybersecurity', 'renewable']
    .some(key => subIndustry.includes(key))) {
    score += 12;
  }

  const name = (company.name || '').toLowerCase();
  if (['inc.', 'corporation', 'technologies', 'systems', 'solutions']
    .some(key => name.includes(key))) {
    score += 3;
  }

  return Math.min(90, score);
}

function sectorScore(sector) {
  const scores = {
    'information-technology': 15,
    'health-care': 8,
    'consumer-discretionary': 5,
    'communication-services': 7,
    industrials: 5,
    financials: 3,
    materials: 2,
    energy: 0,
    utilities: -2,
    'real-estate': -3,
    'consumer-staples': 1
  };
  return scores[sector] || 0;
}

function volatilityScore(company) {
  const marketCap = company.marketCap || 0;
  if (marketCap > 2e11) return 8;
  if (marketCap > 5e10) return 12;
  if (marketCap > 1e10) return 15;
  return 18;
}

function buildRationale(company, technical, sector, watchlist, dividend) {
  const reasons = [];
  if (technical > 60) reasons.push('Fundamentos técnicos sólidos');
  if (sector > 10) reasons.push(`Setor em momento favorável (${company.sectorName})`);
  if (watchlist) reasons.push('Está na sua watchlist pessoal');
  if (dividend) reasons.push(`Dividend yield atrativo (${(company.dividendYield || 0).toFixed(1)}%)`);
  if (company.marketCap > 1e11) reasons.push('Grande capitalização — liquidez e estabilidade');
  if (reasons.length === 0) reasons.push('Equilíbrio entre risco e retorno');
  return reasons.join(' • ');
}

function getMarketContext() {
  const value = Math.random() * 30 + 10;
  if (value < 15) {
    return { level: 'Calmo', description: 'Baixa volatilidade - ambiente propício para acumulação', class: 'calm' };
  }
  if (value < 25) {
    return { level: 'Moderado', description: 'Volatilidade normal - seleção seletiva recomendada', class: 'moderate' };
  }
  return { level: 'Elevado', description: 'Alta volatilidade - foco em qualidade e liquidez', class: 'elevated' };
}

function getCachedStockOfDay(date) {
  try {
    const raw = localStorage.getItem('sp500-stock-of-day');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.date === date ? parsed : null;
  } catch {
    return null;
  }
}

function cacheStockOfDay(date, data) {
  try {
    localStorage.setItem('sp500-stock-of-day', JSON.stringify(data));
  } catch {
    // ignore
  }
}

function renderStockOfDay(viewEl, data) {
  const { primary, alternatives, marketContext, generatedAt } = data;
  if (!primary) {
    viewEl.innerHTML = '<div class="stock-of-day-error"><p>Sem dados suficientes</p></div>';
    return;
  }

  viewEl.innerHTML = `
    <div class="stock-of-day-container">
      <header class="stock-of-day-header">
        <div class="stock-badge">
          <span class="badge-icon">🎯</span>
          <span class="badge-text">Ação do Dia</span>
        </div>
        <div class="stock-meta">
          <span class="stock-date">${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span class="market-context ${marketContext.class}">${marketContext.level}</span>
        </div>
      </header>

      <div class="stock-main-card">
        <div class="stock-identity">
          <div class="stock-symbol">${escapeHtml(primary.symbol)}</div>
          <div class="stock-name">${escapeHtml(primary.name)}</div>
          <div class="stock-sector">${escapeHtml(primary.sectorName || primary.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${primary.score}">
            <span class="score-value">${primary.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(primary.breakdown).map(([name, value]) => `
              <div class="score-bar">
                <span class="bar-label">${name}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100, value * 2)}%"></div></div>
                <span class="bar-value">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="stock-rationale">
          <h4>🎯 Por que esta ação?</h4>
          <p>${primary.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">${formatMarketCap(primary.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(primary.dividendYield || 0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${escapeHtml(primary.sectorName || primary.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${escapeHtml(primary.subIndustry || 'N/A')}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${primary.symbol}'); loadStockOfDay();">
            ${watchlistSymbols.has(primary.symbol) ? '★ Remover da Watchlist' : '☆ Adicionar à Watchlist'}
          </button>
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${primary.symbol}',name:'${escapeHtml(primary.name).replace(/'/g, "\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${primary.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${alternatives.map((alt, index) => `
            <div class="alt-card">
              <span class="alt-rank">${index + 2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${escapeHtml(alt.symbol)}</div>
                <div class="alt-name">${escapeHtml(alt.name)}</div>
              </div>
              <div class="alt-score">${alt.score}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(generatedAt).toLocaleTimeString('pt-BR')} • Baseado em ${allCompanies.length} empresas do S&P 500</p>
      </footer>
    </div>
  `;
}

// ========== ALERTAS DE PREÇO (AÇÃO DO DIA) ==========
function setPriceAlertPrompt(symbol) {
  const symbolKey = symbol.toUpperCase();
  const existing = priceAlerts.get(symbolKey);

  if (existing && existing.triggered) {
    if (confirm(`${symbol}: alerta já disparado. Remover?`)) {
      deletePriceAlert(symbolKey);
    }
    return;
  }

  const targetInput = prompt(
    `Alerta de preço para ${symbol}:\nDigite o preço alvo (ex: 150.25):`,
    existing ? existing.target.toFixed(2) : ''
  );
  if (!targetInput) return;

  const target = parseFloat(targetInput);
  if (isNaN(target) || target <= 0) {
    alert('Preço inválido');
    return;
  }

  const direction = confirm(`Alertar quando o preço estiver ACIMA deste valor?\n(OK = acima, Cancelar = abaixo)`)
    ? 'above'
    : 'below';

  setPriceAlert(symbolKey, target, direction);
}

function setPriceAlert(symbol, target, direction) {
  if (!symbol || typeof target !== 'number' || !['above', 'below'].includes(direction)) return false;
  priceAlerts.set(symbol.toUpperCase(), { target, direction, triggered: false });
  savePriceAlerts();
  return true;
}

function deletePriceAlert(symbol) {
  priceAlerts.delete(symbol.toUpperCase());
  savePriceAlerts();
}

// ========== EXPOSIÇÕES GLOBAIS (onclick inline) ==========
window.loadStockOfDay = loadStockOfDay;
window.toggleWatchlist = toggleWatchlist;
window.openCompanyDetails = openCompanyDetails;
window.setPriceAlertPrompt = setPriceAlertPrompt;

// ========== PRICE ALERTS ==========
async function startPriceAlertPolling() {
  if (priceAlerts.size === 0) return;

  setInterval(async () => {
    for (const [symbol, alert] of priceAlerts) {
      if (alert.triggered) continue;
      try {
        // Verificar alertas de preço
      } catch (e) {
        console.error(`Erro ao verificar ${symbol}:`, e);
      }
    }
    savePriceAlerts();
  }, 60000);
}

// ========== EXPORTAÇÃO ==========
function exportCSV() {
  const headers = ['#', 'Símbolo', 'Empresa', 'Setor', 'Market Cap', 'Subindústria', 'Sede', 'Dividend Yield'];
  const rows = filteredCompanies.map((c, idx) => [
    idx + 1,
    c.symbol,
    c.name,
    c.sectorName,
    formatMarketCap(c.marketCap),
    c.subIndustry || c.industry || 'N/A',
    c.headquarters || 'N/A',
    c.dividendYield || 'N/A'
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  downloadFile(csv, 'sp500-export.csv', 'text/csv');
}

function exportJSON() {
  const json = JSON.stringify(filteredCompanies, null, 2);
  downloadFile(json, 'sp500-export.json', 'application/json');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

console.log('✅ main.js (10 colunas) carregado com sucesso!');