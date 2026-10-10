// ========== IMPORTS ==========
import { API_BASE_URL, SECTORS } from './config.js';
import { loadCuriosidades } from './daily-curiosity.js';
import { escapeHtml, formatDividendYield, formatMarketCap, getCountry } from './utils.js';
import { getPriceHistory } from './api.js';
import { openCompanyDetails } from './company-details.js';
import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { renderBubbleChart } from './bubble-chart.js';
import { renderDividends } from './dividends.js';
import { loadDailySummary } from './daily-summary.js';

// ========== CONSTANTES ==========
const PRICE_ALERTS_STORAGE_KEY = 'sp500-price-alerts';
const PAGE_SIZE = 50;

// ========== FUNÇÕES AUXILIARES (DEFINIDAS PRIMEIRO) ==========

function loadPriceAlerts() {
  try {
    const stored = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
      return parsed;
    }

    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
      return parsed.map((p) => [p.symbol, p]);
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

// ========== MENU DE NAVEGAÇÃO (TRÊS BARRAS) ==========
function closeNavMenu() {
  const navMenu = document.getElementById('nav-menu');
  const menuToggle = document.getElementById('menu-toggle');
  if (navMenu) navMenu.classList.remove('open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
}

function setupNavMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(event.target)) {
      closeNavMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavMenu();
  });
}

// ========== VARIÁVEIS GLOBAIS ==========
let allCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
let currentTab = 'dashboard';
let selectedRows = new Set();
const loadedTabs = new Set();

const priceAlertsArray = loadPriceAlerts();
const priceAlerts = new Map(
  priceAlertsArray && priceAlertsArray.length > 0 ? priceAlertsArray : []
);

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

// ========== INICIALIZAÇÃO ==========
function initDashboard() {
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

  // Event listeners para navegação de abas
  const navTabs = document.querySelectorAll('.nav-tab');

  navTabs.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute('data-tab');
      setActiveTab(tabName);
      closeNavMenu();
    });
  });

  setupNavMenu();

  // Event listeners do dashboard
  if (sectorFilter) sectorFilter.addEventListener('change', applyFilters);
  if (countryFilter) countryFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
  if (dividendMinInput) dividendMinInput.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  if (headerCheckbox) {
    headerCheckbox.addEventListener('change', () => {
      const checked = headerCheckbox.checked;
      const visibleCheckboxes = tableBody.querySelectorAll('.row-checkbox');
      visibleCheckboxes.forEach((cb) => {
        cb.checked = checked;
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
  loadDailySummary();
  startPriceAlertPolling();
}

document.addEventListener('DOMContentLoaded', initDashboard);

// ========== NAVEGAÇÃO DE ABAS ==========
function setActiveTab(tab) {
  currentTab = tab;
  updateUI();
  updateTabButtons();
}

// ========== ATUALIZAR INTERFACE ==========
function loadTabOnce(key, loader) {
  if (loadedTabs.has(key)) return;
  loadedTabs.add(key);
  loader();
}

function updateUI() {
  const dashboardView = document.getElementById('dashboard-view');
  const treemapView = document.getElementById('treemap-view');
  const heatmapView = document.getElementById('heatmap-view');
  const bubbleChartView = document.getElementById('bubble-chart-view');
  const dividendsView = document.getElementById('dividends-view');
  const stockOfDayView = document.getElementById('stock-of-day-view');
  const dailyCuriosityView = document.getElementById('daily-curiosity-view');

  // Hide all views
  const allViews = [
    dashboardView,
    treemapView,
    heatmapView,
    bubbleChartView,
    dividendsView,
    stockOfDayView,
    dailyCuriosityView,
  ];
  allViews.forEach((view) => {
    if (view) view.style.display = 'none';
  });

  // Show active view
  switch (currentTab) {
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
        loadTabOnce('daily-curiosity', loadCuriosidades);
      }
      break;
    case 'treemap':
      if (treemapView) {
        treemapView.style.display = 'block';
        loadTabOnce('treemap', loadTreemap);
      }
      break;
    case 'heatmap':
      if (heatmapView) {
        heatmapView.style.display = 'block';
        loadTabOnce('heatmap', loadHeatmap);
      }
      break;
    case 'bubble':
      if (bubbleChartView) {
        bubbleChartView.style.display = 'block';
        loadBubbleChart();
      }
      break;
    case 'dividends':
      if (dividendsView) {
        dividendsView.style.display = 'block';
        loadDividends();
      }
      break;
    default:
      if (dashboardView) dashboardView.style.display = 'block';
  }
}

// ========== BUBBLE CHART ==========
function loadBubbleChart() {
  const bubbleChartView = document.getElementById('bubble-chart-view');
  if (!bubbleChartView) {
    console.error('❌ bubble-chart-view não encontrado!');
    return;
  }

  bubbleChartView.innerHTML =
    '<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>';

  // Renderizar o bubble chart com os dados carregados
  renderBubbleChart(allCompanies, 'bubble-chart-view');
}

// ========== DIVIDENDOS ==========
function loadDividends() {
  const dividendsView = document.getElementById('dividends-view');
  if (!dividendsView) {
    console.error('❌ dividends-view não encontrado!');
    return;
  }

  if (allCompanies.length === 0) {
    dividendsView.innerHTML =
      '<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';
    return;
  }

  renderDividends(allCompanies, 'dividends-view');
}

function updateTabButtons() {
  const buttons = document.querySelectorAll('.nav-tab');
  buttons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === currentTab) {
      btn.classList.add('active');
    }
  });
}

// ========== CARREGAMENTO DE DADOS ==========
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

        const sector = SECTORS.find((s) => s.id === setorId);
        const sectorName = sector ? sector.name : setorId;

        if (data.dados && data.dados.companies && Array.isArray(data.dados.companies)) {
          return {
            generatedAt: data.dados.generatedAt || null,
            companies: data.dados.companies.map((c) => ({
              ...c,
              sector: setorId,
              sectorName: sectorName,
            })),
          };
        }
        return { generatedAt: null, companies: [] };
      } catch (e) {
        console.error(`❌ Erro ao carregar ${setorId}:`, e);
        return { generatedAt: null, companies: [] };
      }
    });

    const results = await Promise.all(promises);
    allCompanies = results.flatMap((r) => r.companies);

    updateFreshnessBadge(results.map((r) => r.generatedAt).filter(Boolean));

    if (sectorFilter) {
      sectorFilter.innerHTML = '<option value="">Todos os Setores</option>';
      const setorUnico = new Set(allCompanies.map((c) => c.sector));
      [...setorUnico].sort().forEach((sector) => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = SECTORS.find((s) => s.id === sector)?.name || sector;
        sectorFilter.appendChild(option);
      });
    }

    if (countryFilter) {
      countryFilter.innerHTML = '<option value="">Todos os Países</option>';
      const paisUnico = new Set(allCompanies.map((c) => getCountry(c.headquarters)));
      [...paisUnico].sort().forEach((pais) => {
        const option = document.createElement('option');
        option.value = pais;
        option.textContent = pais;
        countryFilter.appendChild(option);
      });
    }

    applyFilters();
    updateStats();
    if (currentTab === 'bubble') loadBubbleChart();
    if (currentTab === 'dividends') loadDividends();
  } catch (erro) {
    console.error('❌ Erro ao carregar dados:', erro);
    if (statsEl) statsEl.textContent = 'Erro ao carregar dados. Tente novamente.';
    updateFreshnessBadge([]);
  }
}

// ========== FRESHNESS BADGE ==========
function updateFreshnessBadge(dates) {
  const badge = document.getElementById('freshness-badge');
  const text = document.getElementById('freshness-text');
  if (!text) return;

  const valid = (dates || []).map((d) => new Date(d)).filter((d) => !Number.isNaN(d.getTime()));

  if (valid.length === 0) {
    if (badge) {
      badge.classList.remove('fd-fresh', 'fd-aging', 'fd-stale');
      badge.classList.add('fd-unknown');
    }
    text.textContent = 'Data indisponível';
    return;
  }

  const latest = new Date(Math.max(...valid.map((d) => d.getTime())));
  const ageInDays = Math.floor((Date.now() - latest.getTime()) / 86400000);

  let freshnessClass = 'fd-fresh';
  if (ageInDays > 30) freshnessClass = 'fd-stale';
  else if (ageInDays > 7) freshnessClass = 'fd-aging';

  if (badge) {
    badge.classList.remove('fd-fresh', 'fd-aging', 'fd-stale', 'fd-unknown');
    badge.classList.add(freshnessClass);
  }

  const formatted = latest.toLocaleDateString('pt-BR');
  text.textContent = `Dados de ${formatted}`;
  if (badge) badge.title = `Última atualização dos dados: ${formatted}`;
}

// ========== FILTROS E ORDENAÇÃO ==========
function applyFilters() {
  const sector = sectorFilter ? sectorFilter.value : '';
  const country = countryFilter ? countryFilter.value : '';
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const dividendMin = dividendMinInput ? parseFloat(dividendMinInput.value) || 0 : 0;
  const sortBy = sortSelect ? sortSelect.value : 'symbol-asc';

  filteredCompanies = allCompanies.filter((c) => {
    const matchesSector = !sector || c.sector === sector;
    const matchesCountry = !country || getCountry(c.headquarters) === country;
    const matchesSearch =
      !searchTerm ||
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

  pageCompanies.forEach((company, index) => {
    const isSelected = selectedRows.has(company.symbol);
    const symbol = escapeHtml(company.symbol);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${symbol}" 
          ${isSelected ? 'checked' : ''}>
      </td>
      <td class="col-index">${start + index + 1}</td>
      <td><strong>${escapeHtml(company.symbol)}</strong></td>
      <td>${escapeHtml(company.name || 'N/A')}</td>
      <td>${escapeHtml(company.sectorName || company.sector || 'N/A')}</td>
      <td>${formatMarketCap(company.marketCap)}</td>
      <td>${escapeHtml(company.subIndustry || company.industry || 'N/A')}</td>
      <td>${escapeHtml(company.headquarters || 'N/A')}</td>
      <td>${formatDividendYield(company)}</td>
    `;

    const checkbox = row.querySelector('.row-checkbox');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedRows.add(company.symbol);
      } else {
        selectedRows.delete(company.symbol);
      }
      updateStats();
      updateHeaderCheckbox();
    });

    tableBody.appendChild(row);
  });

  updateHeaderCheckbox();
  renderPagination();
}

function updateHeaderCheckbox() {
  if (!headerCheckbox || !tableBody) return;
  const visibleCheckboxes = tableBody.querySelectorAll('.row-checkbox');
  const checkedCount = Array.from(visibleCheckboxes).filter((cb) => cb.checked).length;
  headerCheckbox.checked =
    visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
  headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
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
  const payers = filteredCompanies.filter((c) => Number(c.dividendYield) > 0);
  const avgDividend =
    payers.length > 0
      ? (payers.reduce((sum, c) => sum + Number(c.dividendYield), 0) / payers.length).toFixed(2)
      : '0.00';

  statsEl.innerHTML = `Total: ${total} | Selecionadas: ${selected} | Yield Médio (pagadoras): ${avgDividend}%`;
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

    if (allCompanies.length === 0) {
      stockOfDayView.innerHTML = `
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const cached = getCachedStockOfDay(today);
    if (cached) {
      renderStockOfDay(stockOfDayView, cached);
      return;
    }
    const generated = await generateStockOfDay();
    if (generated.primary) cacheStockOfDay(today, generated);
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      const seed = dateToSeed(today);

      const ranked = allCompanies
        .filter((d) => d.marketCap && d.marketCap > 1e9)
        .map((d) => {
          const technical = technicalScore(d);
          const sector = sectorScore(d.sector);
          const dividend = (d.dividendYield || 0) > 2 ? 10 : 0;
          const liquidity = Math.min(20, Math.log10(d.marketCap / 1e9) * 5);
          const volatility = volatilityScore(d);
          const score = technical + sector + dividend + liquidity + volatility;

          return {
            ...d,
            score: Math.round(score * 100) / 100,
            breakdown: {
              technical,
              sector,
              dividend,
              liquidity: Math.round(liquidity),
              volatility: Math.round(volatility),
            },
            rationale: buildRationale(d, technical, sector, dividend),
          };
        })
        .sort((a, b) => b.score - a.score);

      if (ranked.length === 0) {
        resolve({
          date: today,
          primary: null,
          alternatives: [],
          marketContext: getMarketContext(),
          generatedAt: new Date().toISOString(),
        });
        return;
      }

      const top = ranked.slice(0, Math.min(10, ranked.length));
      const index = seed % top.length;
      const primary = top[index];
      const alternatives = top.filter((d, i) => i !== index).slice(0, 3);

      resolve({
        date: today,
        primary,
        alternatives,
        marketContext: getMarketContext(),
        generatedAt: new Date().toISOString(),
      });
    }, 100);
  });
}

export function dateToSeed(date) {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function technicalScore(company) {
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
  if (
    [
      'software',
      'semiconductors',
      'biotechnology',
      'cloud',
      'ai',
      'cybersecurity',
      'renewable',
    ].some((key) => subIndustry.includes(key))
  ) {
    score += 12;
  }

  const name = (company.name || '').toLowerCase();
  if (
    ['inc.', 'corporation', 'technologies', 'systems', 'solutions'].some((key) =>
      name.includes(key)
    )
  ) {
    score += 3;
  }

  return Math.min(90, score);
}

export function sectorScore(sector) {
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
    'consumer-staples': 1,
  };
  return scores[sector] || 0;
}

export function volatilityScore(company) {
  const marketCap = company.marketCap || 0;
  if (marketCap > 2e11) return 8;
  if (marketCap > 5e10) return 12;
  if (marketCap > 1e10) return 15;
  return 18;
}

export function buildRationale(company, technical, sector, dividend) {
  const reasons = [];
  if (technical > 60) reasons.push('Fundamentos técnicos sólidos');
  if (sector > 10) reasons.push(`Setor em momento favorável (${company.sectorName})`);
  if (dividend)
    reasons.push(`Dividend yield atrativo (${(company.dividendYield || 0).toFixed(1)}%)`);
  if (company.marketCap > 1e11) reasons.push('Grande capitalização — liquidez e estabilidade');
  if (reasons.length === 0) reasons.push('Equilíbrio entre risco e retorno');
  return reasons.join(' • ');
}

function getMarketContext() {
  const value = Math.random() * 30 + 10;
  if (value < 15) {
    return {
      level: 'Calmo',
      description: 'Baixa volatilidade - ambiente propício para acumulação',
      class: 'calm',
    };
  }
  if (value < 25) {
    return {
      level: 'Moderado',
      description: 'Volatilidade normal - seleção seletiva recomendada',
      class: 'moderate',
    };
  }
  return {
    level: 'Elevado',
    description: 'Alta volatilidade - foco em qualidade e liquidez',
    class: 'elevated',
  };
}

function getCachedStockOfDay(date) {
  try {
    const raw = localStorage.getItem('sp500-stock-of-day');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.date === date && parsed.primary ? parsed : null;
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
    viewEl.innerHTML = `
      <div class="stock-of-day-error">
        <h3>⚠️ Sem dados suficientes</h3>
        <p>Não foi possível selecionar uma ação com os dados disponíveis.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `;
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
            ${Object.entries(primary.breakdown)
              .map(
                ([name, value]) => `
              <div class="score-bar">
                <span class="bar-label">${name}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100, value * 2)}%"></div></div>
                <span class="bar-value">${value}</span>
              </div>
            `
              )
              .join('')}
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
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${primary.symbol}',name:'${escapeHtml(primary.name).replace(/'/g, "\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${primary.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${alternatives
            .map(
              (alt, index) => `
            <div class="alt-card">
              <span class="alt-rank">${index + 2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${escapeHtml(alt.symbol)}</div>
                <div class="alt-name">${escapeHtml(alt.name)}</div>
              </div>
              <div class="alt-score">${alt.score}</div>
            </div>
          `
            )
            .join('')}
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

  const direction = confirm(
    `Alertar quando o preço estiver ACIMA deste valor?\n(OK = acima, Cancelar = abaixo)`
  )
    ? 'above'
    : 'below';

  setPriceAlert(symbolKey, target, direction);
}

function setPriceAlert(symbol, target, direction) {
  if (!symbol || typeof target !== 'number' || !['above', 'below'].includes(direction))
    return false;
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
window.openCompanyDetails = openCompanyDetails;
window.setPriceAlertPrompt = setPriceAlertPrompt;

// ========== PRICE ALERTS ==========
async function checkPriceAlerts() {
  const triggered = [];

  for (const [symbol, alerta] of priceAlerts) {
    if (alerta.triggered) continue;
    try {
      const registros = await getPriceHistory(symbol);
      const ultimo = registros[registros.length - 1];
      const preco = ultimo ? Number(ultimo.close) : NaN;
      if (!Number.isFinite(preco)) continue;

      const atingiu =
        (alerta.direction === 'above' && preco >= alerta.target) ||
        (alerta.direction === 'below' && preco <= alerta.target);

      if (atingiu) {
        alerta.triggered = true;
        alerta.triggeredAt = new Date().toISOString();
        alerta.triggeredPrice = preco;
        triggered.push(`${symbol} ($${preco.toFixed(2)})`);
      }
    } catch (e) {
      console.error(`Erro ao verificar ${symbol}:`, e);
    }
  }

  if (triggered.length > 0) {
    savePriceAlerts();
    window.alert(`🔔 Alerta(s) de preço atingido(s): ${triggered.join(', ')}`);
  }

  return triggered;
}

async function startPriceAlertPolling() {
  if (priceAlerts.size === 0) return;

  setInterval(async () => {
    await checkPriceAlerts();
    savePriceAlerts();
  }, 60000);
}

// ========== EXPORTAÇÃO ==========
function csvCell(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCSV() {
  const headers = [
    '#',
    'Símbolo',
    'Empresa',
    'Setor',
    'Market Cap',
    'Subindústria',
    'Sede',
    'Dividend Yield',
  ];
  const rows = filteredCompanies.map((c, idx) => [
    idx + 1,
    c.symbol,
    c.name,
    c.sectorName,
    formatMarketCap(c.marketCap),
    c.subIndustry || c.industry || 'N/A',
    c.headquarters || 'N/A',
    formatDividendYield(c),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
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

// ========== EXPORTAÇÕES PARA TESTES ==========
// dateToSeed, technicalScore, sectorScore, volatilityScore e buildRationale
// já são exportados acima.
export {
  loadPriceAlerts,
  savePriceAlerts,
  debounce,
  initDashboard,
  setActiveTab,
  updateUI,
  loadBubbleChart,
  loadDividends,
  updateTabButtons,
  loadDashboardData,
  updateFreshnessBadge,
  applyFilters,
  renderTable,
  renderPagination,
  updateStats,
  loadStockOfDay,
  generateStockOfDay,
  getMarketContext,
  getCachedStockOfDay,
  cacheStockOfDay,
  renderStockOfDay,
  setPriceAlertPrompt,
  setPriceAlert,
  deletePriceAlert,
  checkPriceAlerts,
  startPriceAlertPolling,
  exportCSV,
  exportJSON,
  downloadFile,
};
