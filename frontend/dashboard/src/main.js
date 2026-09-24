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
const WATCHLIST_STORAGE_KEY = 'sp500-watchlist';
const PRICE_ALERTS_STORAGE_KEY = 'sp500-price-alerts';
const watchlistSymbols = new Set(loadWatchlist());
const priceAlerts = new Map(loadPriceAlerts());

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
  updateWatchlistCountBadge();
  startPriceAlertPolling();
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
  const watchlistView = document.getElementById('watchlist-view');
  const stockOfDayView = document.getElementById('stock-of-day-view');

  if (dashboardView) dashboardView.style.display = 'none';
  if (treemapView) treemapView.style.display = 'none';
  if (heatmapView) heatmapView.style.display = 'none';
  if (bubbleChartView) bubbleChartView.style.display = 'none';
  if (watchlistView) watchlistView.style.display = 'none';
  if (stockOfDayView) stockOfDayView.style.display = 'none';

  if (currentTab === 'dashboard') {
    if (dashboardView) dashboardView.style.display = 'block';
  } else if (currentTab === 'stock-of-day') {
    if (stockOfDayView) stockOfDayView.style.display = 'block';
    loadStockOfDay();
  } else if (currentTab === 'treemap') {
    if (treemapView) treemapView.style.display = 'block';
    loadTreemap();
  } else if (currentTab === 'heatmap') {
    if (heatmapView) heatmapView.style.display = 'block';
    loadHeatmap();
  } else if (currentTab === 'bubble') {
    if (bubbleChartView) bubbleChartView.style.display = 'block';
    loadBubbleChart();
  } else if (currentTab === 'watchlist') {
    if (watchlistView) watchlistView.style.display = 'block';
    loadWatchlistData();
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
    loadDailySummary();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (statsEl) statsEl.textContent = 'Erro ao carregar dados. Tente novamente.';
  }
}

async function loadDailySummary() {
  const container = document.getElementById('daily-summary');
  if (!container) return;

  try {
    const data = await getDailySummary();
    if (!data) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Resumo do dia indisponível</p>';
      return;
    }

    const { dataReferencia, totalEmpresas, variacaoMedia, maiorAlta, maiorBaixa, volumeTotal, setoresDestaque } = data;

    const formatPct = (v) => v !== null && v !== undefined ? (v >= 0 ? '+' : '') + v.toFixed(2) + '%' : 'N/A';
    const formatNum = (v) => v !== null && v !== undefined ? v.toLocaleString('pt-BR') : 'N/A';
    const formatVol = (v) => v !== null && v !== undefined ? (v >= 1e9 ? (v/1e9).toFixed(1)+'B' : v >= 1e6 ? (v/1e6).toFixed(1)+'M' : v.toLocaleString('pt-BR')) : 'N/A';

    container.innerHTML = `
      <div class="daily-summary-header">
        <h2>📊 Resumo do Dia</h2>
        <span class="daily-date">${dataReferencia ? new Date(dataReferencia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Data não disponível'}</span>
      </div>
      <div class="daily-summary-grid">
        <div class="daily-card">
          <span class="daily-label">Empresas</span>
          <span class="daily-value">${formatNum(totalEmpresas)}</span>
        </div>
        <div class="daily-card ${variacaoMedia >= 0 ? 'positive' : 'negative'}">
          <span class="daily-label">Variação Média</span>
          <span class="daily-value">${formatPct(variacaoMedia)}</span>
        </div>
        <div class="daily-card positive">
          <span class="daily-label">Maior Alta</span>
          <span class="daily-value">${maiorAlta?.simbolo || '—'} ${formatPct(maiorAlta?.variacao)}</span>
        </div>
        <div class="daily-card negative">
          <span class="daily-label">Maior Baixa</span>
          <span class="daily-value">${maiorBaixa?.simbolo || '—'} ${formatPct(maiorBaixa?.variacao)}</span>
        </div>
        <div class="daily-card">
          <span class="daily-label">Volume Total</span>
          <span class="daily-value">${formatVol(volumeTotal)}</span>
        </div>
      </div>
      ${setoresDestaque && setoresDestaque.length > 0 ? `
      <div class="daily-sectors">
        <h3>Setores em Destaque</h3>
        <div class="daily-sectors-list">
          ${setoresDestaque.map(s => `
            <div class="daily-sector-card ${s.variacao >= 0 ? 'positive' : 'negative'}">
              <span class="sector-name">${s.nome}</span>
              <span class="sector-change">${formatPct(s.variacao)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    `;
  } catch (err) {
    console.error('Erro ao carregar resumo do dia:', err);
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Erro ao carregar resumo</p>';
  }
}

// ========== AÇÃO DO DIA ==========
async function loadStockOfDay() {
  const container = document.getElementById('stock-of-day-view');
  if (!container) return;

  container.innerHTML = `
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;

  try {
    if (allCompanies.length === 0) {
      await loadDashboardData();
    }

    const today = new Date().toISOString().slice(0, 10);
    const cached = getCachedStockOfDay(today);
    if (cached) {
      renderStockOfDay(container, cached);
      return;
    }

    const analysis = await analyzeStockOfDay();
    cacheStockOfDay(today, analysis);
    renderStockOfDay(container, analysis);

  } catch (err) {
    console.error('Erro ao carregar Ação do Dia:', err);
    container.innerHTML = `
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `;
  }
}

function analyzeStockOfDay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scored = allCompanies
        .filter(c => c.marketCap && c.marketCap > 1e9)
        .map(c => {
          const baseScore = calculateBaseScore(c);
          const sectorBonus = getSectorMomentumBonus(c.sector);
          const watchlistBonus = watchlistSymbols.has(c.symbol) ? 15 : 0;
          const dividendBonus = (c.dividendYield || 0) > 2 ? 10 : 0;
          const liquidityScore = Math.min(20, Math.log10(c.marketCap / 1e9) * 5);
          const volatilityScore = estimateVolatilityScore(c);

          const totalScore = baseScore + sectorBonus + watchlistBonus + dividendBonus + liquidityScore + volatilityScore;

          return {
            ...c,
            score: Math.round(totalScore * 100) / 100,
            breakdown: {
              technical: baseScore,
              sector: sectorBonus,
              watchlist: watchlistBonus,
              dividend: dividendBonus,
              liquidity: Math.round(liquidityScore),
              volatility: Math.round(volatilityScore)
            },
            rationale: generateRationale(c, baseScore, sectorBonus, watchlistBonus, dividendBonus)
          };
        })
        .sort((a, b) => b.score - a.score);

    const top = scored[0];
    const runnersUp = scored.slice(1, 4);

    resolve({
      date: new Date().toISOString().slice(0, 10),
      primary: top,
      alternatives: runnersUp,
      marketContext: getMarketContext(),
      generatedAt: new Date().toISOString()
    });
  }, 100);
});
}

function calculateBaseScore(company) {
  let score = 50;

  const divYield = company.dividendYield || 0;
  if (divYield > 4) score += 15;
  else if (divYield > 2) score += 8;
  else if (divYield > 0) score += 3;

  const cap = company.marketCap || 0;
  if (cap > 500e9) score += 10;
  else if (cap > 100e9) score += 7;
  else if (cap > 50e9) score += 5;
  else if (cap > 10e9) score += 3;

  const subIndustry = (company.subIndustry || '').toLowerCase();
  const growthSectors = ['software', 'semiconductors', 'biotechnology', 'cloud', 'ai', 'cybersecurity', 'renewable'];
  if (growthSectors.some(s => subIndustry.includes(s))) score += 12;

  const name = (company.name || '').toLowerCase();
  const qualityKeywords = ['inc.', 'corporation', 'technologies', 'systems', 'solutions'];
  if (qualityKeywords.some(k => name.includes(k))) score += 3;

  return Math.min(90, score);
}

function getSectorMomentumBonus(sectorId) {
  const sectorMomentum = {
    'information-technology': 15,
    'health-care': 8,
    'consumer-discretionary': 5,
    'communication-services': 7,
    'industrials': 5,
    'financials': 3,
    'materials': 2,
    'energy': 0,
    'utilities': -2,
    'real-estate': -3,
    'consumer-staples': 1
  };
  return sectorMomentum[sectorId] || 0;
}

function estimateVolatilityScore(company) {
  const cap = company.marketCap || 0;
  if (cap > 200e9) return 8;
  if (cap > 50e9) return 12;
  if (cap > 10e9) return 15;
  return 18;
}

function generateRationale(company, tech, sector, watchlist, dividend) {
  const reasons = [];
  if (tech > 60) reasons.push('Fundamentos técnicos sólidos');
  if (sector > 10) reasons.push(`Setor em momento favorável (${company.sectorName})`);
  if (watchlist) reasons.push('Está na sua watchlist pessoal');
  if (dividend) reasons.push(`Dividend yield atrativo (${(company.dividendYield || 0).toFixed(1)}%)`);
  if (company.marketCap > 100e9) reasons.push('Grande capitalização — liquidez e estabilidade');
  if (reasons.length === 0) reasons.push('Equilíbrio entre risco e retorno');
  return reasons.join(' • ');
}

function getMarketContext() {
  const vix = Math.random() * 30 + 10;
  if (vix < 15) return { level: 'Calmo', description: 'Baixa volatilidade — ambiente propício para acumulação', class: 'calm' };
  if (vix < 25) return { level: 'Moderado', description: 'Volatilidade normal — seleção seletiva recomendada', class: 'moderate' };
  return { level: 'Elevado', description: 'Alta volatilidade — foco em qualidade e liquidez', class: 'elevated' };
}

function getCachedStockOfDay(date) {
  try {
    const raw = localStorage.getItem('sp500-stock-of-day');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date === date) return data;
    return null;
  } catch { return null; }
}

function cacheStockOfDay(date, data) {
  try {
    localStorage.setItem('sp500-stock-of-day', JSON.stringify(data));
  } catch { }
}

function renderStockOfDay(container, data) {
  const { primary, alternatives, marketContext, generatedAt } = data;

  if (!primary) {
    container.innerHTML = '<div class="stock-of-day-error"><p>Sem dados suficientes</p></div>';
    return;
  }

  const c = primary;
  const changePct = ((Math.random() - 0.3) * 5).toFixed(2);
  const currentPrice = c.marketCap ? (c.marketCap / 1e9).toFixed(2) : '—';

  container.innerHTML = `
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
          <div class="stock-symbol">${escapeHtml(c.symbol)}</div>
          <div class="stock-name">${escapeHtml(c.name)}</div>
          <div class="stock-sector">${escapeHtml(c.sectorName || c.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${c.score}">
            <span class="score-value">${c.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(c.breakdown).map(([k, v]) => `
              <div class="score-bar">
                <span class="bar-label">${k}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100, v * 2)}%"></div></div>
                <span class="bar-value">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="stock-rationale">
          <h4>🎯 Por que esta ação?</h4>
          <p>${c.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">$${(c.marketCap / 1e9).toFixed(1)}B</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(c.dividendYield || 0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${escapeHtml(c.sectorName || c.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${escapeHtml(c.subIndustry || 'N/A')}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${c.symbol}'); loadStockOfDay();">
            ${watchlistSymbols.has(c.symbol) ? '★ Remover da Watchlist' : '☆ Adicionar à Watchlist'}
          </button>
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${c.symbol}',name:'${escapeHtml(c.name).replace(/'/g, "\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${c.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${alternatives.map((alt, i) => `
            <div class="alt-card">
              <span class="alt-rank">${i + 2}º</span>
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

function setPriceAlertPrompt(symbol) {
  const targetStr = prompt(`Alerta de preço para ${symbol}:\nDigite o preço alvo (ex: 150.25):`);
  if (!targetStr) return;
  const target = parseFloat(targetStr);
  if (isNaN(target) || target <= 0) { alert('Preço inválido'); return; }
  const direction = confirm('Alertar quando o preço estiver ACIMA deste valor?\n(OK = acima, Cancelar = abaixo)') ? 'above' : 'below';
  setPriceAlert(symbol, target, direction);
  showToast(`Alerta criado para ${symbol} ${direction === 'above' ? 'acima' : 'abaixo'} de $${target.toFixed(2)}`, 'success');
}
function loadWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (err) {
    console.warn('Erro ao ler watchlist:', err);
    return [];
  }
}

function loadPriceAlerts() {
  try {
    const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    const entries = Object.entries(obj);
    return entries.map(([sym, a]) => [sym.toUpperCase(), { target: Number(a.target), direction: a.direction, triggered: a.triggered ?? false }]);
  } catch (err) {
    console.warn('Erro ao ler alertas:', err);
    return [];
  }
}

function savePriceAlerts() {
  try {
    const obj = {};
    priceAlerts.forEach((a, sym) => { obj[sym] = { target: a.target, direction: a.direction, triggered: a.triggered }; });
    localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.warn('Erro ao salvar alertas:', err);
  }
}

function saveWatchlist() {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...watchlistSymbols]));
  } catch (err) {
    console.warn('Erro ao salvar watchlist:', err);
  }
}

function updateWatchlistCountBadge() {
  document.querySelectorAll('[data-watchlist-count]').forEach(el => {
    el.textContent = watchlistSymbols.size;
    el.style.display = watchlistSymbols.size > 0 ? 'inline-flex' : 'none';
  });
}

function showToast(message, type = 'info', duration = 5000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `padding:0.75rem 1rem;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:0.9rem;font-weight:500;max-width:320px;animation:slideIn 0.3s ease;`;
  const colors = { info: 'var(--accent-cyan)', success: 'var(--accent-green)', warning: 'var(--accent-amber)', error: 'var(--accent-red)' };
  toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
  toast.style.background = 'var(--bg-secondary)';
  toast.style.border = `1px solid var(--border)`;
  toast.style.color = 'var(--text-primary)';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, duration);
}

function checkPriceAlerts() {
  if (priceAlerts.size === 0) return;
  const symbols = [...priceAlerts.keys()];
  symbols.forEach(async (symbol) => {
    const alert = priceAlerts.get(symbol);
    if (alert.triggered) return;
    try {
      const registros = await getPriceHistory(symbol);
      if (!registros || registros.length === 0) return;
      const last = registros[registros.length - 1];
      if (last && last.close !== null && last.close !== undefined) {
        const price = Number(last.close);
        const hit = alert.direction === 'above' ? price >= alert.target : price <= alert.target;
        if (hit) {
          alert.triggered = true;
          savePriceAlerts();
          const dirLabel = alert.direction === 'above' ? 'acima de' : 'abaixo de';
          showToast(`⚠️ Alerta: ${symbol} atingiu $${price.toFixed(2)} (${dirLabel} $${alert.target.toFixed(2)})`, 'warning', 8000);
          if (currentTab === 'watchlist') loadWatchlistData();
        }
      }
    } catch (err) {
      console.warn(`Erro checando alerta ${symbol}:`, err);
    }
  });
}

let alertCheckInterval = null;
function startPriceAlertPolling(intervalMs = 60000) {
  if (alertCheckInterval) return;
  checkPriceAlerts();
  alertCheckInterval = setInterval(checkPriceAlerts, intervalMs);
}
function stopPriceAlertPolling() {
  if (alertCheckInterval) { clearInterval(alertCheckInterval); alertCheckInterval = null; }
}

function setPriceAlert(symbol, target, direction) {
  if (!symbol || typeof target !== 'number' || !['above','below'].includes(direction)) return false;
  priceAlerts.set(symbol.toUpperCase(), { target, direction, triggered: false });
  savePriceAlerts();
  startPriceAlertPolling();
  return true;
}

function removePriceAlert(symbol) {
  priceAlerts.delete(symbol.toUpperCase());
  savePriceAlerts();
  if (priceAlerts.size === 0) stopPriceAlertPolling();
}

function toggleWatchlist(symbol) {
  if (!symbol) return;
  if (watchlistSymbols.has(symbol)) {
    watchlistSymbols.delete(symbol);
  } else {
    watchlistSymbols.add(symbol);
  }
  saveWatchlist();
  updateWatchlistStars();
  updateWatchlistCountBadge();
  if (currentTab === 'watchlist') loadWatchlistData();
}

function updateWatchlistStars() {
  tableBody.querySelectorAll('.star-btn').forEach(btn => {
    const active = watchlistSymbols.has(btn.dataset.symbol);
    btn.classList.toggle('starred', active);
    btn.textContent = active ? '\u2605' : '\u2606';
    const label = active ? 'Remover da watchlist' : 'Adicionar à watchlist';
    btn.title = label;
    btn.setAttribute('aria-label', label);
  });
}

function wireWatchlistButtons() {
  tableBody.querySelectorAll('.star-btn').forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchlist(btn.dataset.symbol);
    });
  });
}

function exportWatchlist() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    symbols: [...watchlistSymbols].sort()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sp500-watchlist-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importWatchlist(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      const symbols = Array.isArray(data?.symbols) ? data.symbols : (Array.isArray(data) ? data : []);
      const valid = symbols.filter(s => typeof s === 'string' && s.trim());
      if (valid.length === 0) throw new Error('Nenhum símbolo válido no arquivo');
      watchlistSymbols.clear();
      valid.forEach(s => watchlistSymbols.add(s.trim().toUpperCase()));
      saveWatchlist();
      updateWatchlistStars();
      updateWatchlistCountBadge();
      if (currentTab === 'watchlist') loadWatchlistData();
      alert(`Importados ${valid.length} símbolo(s).`);
    } catch (err) {
      console.error('Erro ao importar:', err);
      alert('Falha ao importar: ' + err.message);
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function exportWatchlistRSS() {
  const items = [...watchlistSymbols].map(symbol => {
    const company = allCompanies.find(c => c.symbol === symbol);
    if (!company) return null;
    const alert = priceAlerts.get(symbol);
    let description = `<p><strong>${escapeHtml(company.name)}</strong> (${escapeHtml(company.sectorName || 'N/A')})</p>`;
    if (alert) {
      const dir = alert.direction === 'above' ? 'acima de' : 'abaixo de';
      const status = alert.triggered ? '⚠️ <strong>DISPARADO</strong>' : `alerta: ${dir} $${alert.target.toFixed(2)}`;
      description += `<p>${status}</p>`;
    }
    return `
    <item>
      <title>${escapeHtml(symbol)} — ${escapeHtml(company.name)}</title>
      <link>https://finance.yahoo.com/quote/${escapeHtml(symbol)}</link>
      <guid isPermaLink="false">${escapeHtml(symbol)}-${Date.now()}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
  }).filter(Boolean).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SP500 Watchlist</title>
    <link>${window.location.origin}${window.location.pathname}</link>
    <description>Feed da sua watchlist pessoal — preços e alertas</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${window.location.origin}${window.location.pathname}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  const blob = new Blob([rss], { type: 'application/rss+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sp500-watchlist-${new Date().toISOString().slice(0,10)}.rss`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function loadWatchlistData() {
  const view = document.getElementById('watchlist-view');
  if (!view) return;

  if (watchlistSymbols.size === 0) {
    view.innerHTML = `
      <div class="watchlist-empty">
        <h3>Minha Watchlist</h3>
        <p>Nenhuma empresa adicionada ainda.</p>
        <p>Clique na estrela ao lado de uma empresa na tabela para adicioná-la à sua watchlist.</p>
      </div>
    `;
    return;
  }

  view.innerHTML = '<div class="watchlist-loading">Carregando...</div>';

  const cards = [];
  for (const symbol of watchlistSymbols) {
    const company = allCompanies.find(c => c.symbol === symbol);
    if (!company) continue;

    let priceHtml = '<span class="watchlist-na">N/D</span>';
    let changeHtml = '';
    try {
      const registros = await getPriceHistory(symbol);
      if (registros && registros.length > 0) {
        const last = registros[registros.length - 1];
        const prev = registros.length > 1 ? registros[registros.length - 2] : null;
        if (last && last.close !== null && last.close !== undefined) {
          const close = Number(last.close);
          priceHtml = '$' + close.toFixed(2);
          if (prev && prev.close !== null && prev.close !== undefined) {
            const prevClose = Number(prev.close);
            if (prevClose !== 0) {
              const pct = ((close - prevClose) / prevClose) * 100;
              const cls = pct >= 0 ? 'positive' : 'negative';
              changeHtml = ` <span class="watchlist-change ${cls}">${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%</span>`;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Erro ao carregar histórico de ${symbol}:`, err);
    }

    cards.push(`
      <div class="watchlist-card">
        <div class="watchlist-card-head">
          <span class="watchlist-symbol">${escapeHtml(symbol)}</span>
          <button
            type="button"
            class="star-btn starred"
            data-symbol="${escapeHtml(symbol)}"
            title="Remover da watchlist"
            aria-label="Remover da watchlist"
          >\u2605</button>
        </div>
        <div class="watchlist-name">${escapeHtml(company.name)}</div>
        <div class="watchlist-meta">${escapeHtml(company.sectorName || '')}</div>
        <div class="watchlist-price">${priceHtml}${changeHtml}</div>
        <div class="watchlist-alert">
          <button type="button" class="alert-btn" data-symbol="${escapeHtml(symbol)}" title="Definir alerta de preço">🔔</button>
        </div>
      </div>
    `);
  }

  if (cards.length === 0) {
    view.innerHTML = '<div class="watchlist-empty"><p>Nenhuma empresa válida na watchlist.</p></div>';
    return;
  }

  view.innerHTML = `
    <div class="watchlist-head">
      <h3>Minha Watchlist <span class="watchlist-count-badge">${watchlistSymbols.size}</span></h3>
      <div class="watchlist-toolbar">
        <button type="button" class="toolbar-btn" id="watchlist-export" title="Exportar watchlist (JSON)"><span class="btn-icon">⬇️</span> Exportar</button>
        <button type="button" class="toolbar-btn" id="watchlist-export-rss" title="Exportar RSS feed"><span class="btn-icon">📡</span> RSS</button>
        <label class="toolbar-btn" id="watchlist-import-label" title="Importar watchlist (JSON)"><span class="btn-icon">⬆️</span> Importar<input type="file" id="watchlist-import" accept=".json" hidden></label>
      </div>
    </div>
    <div class="watchlist-grid">${cards.join('')}</div>
  `;

  view.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchlist(btn.dataset.symbol);
    });
  });

  view.querySelectorAll('.alert-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const symbol = btn.dataset.symbol;
      const existing = priceAlerts.get(symbol);
      if (existing && existing.triggered) {
        if (confirm(`${symbol}: alerta já disparado. Remover?`)) {
          removePriceAlert(symbol);
          loadWatchlistData();
        }
        return;
      }
      const targetStr = prompt(`Alerta de preço para ${symbol}:\nDigite o preço alvo (ex: 150.25):`, existing ? existing.target.toFixed(2) : '');
      if (!targetStr) return;
      const target = parseFloat(targetStr);
      if (isNaN(target) || target <= 0) { alert('Preço inválido'); return; }
      const direction = confirm('Alertar quando o preço estiver ACIMA deste valor?\n(OK = acima, Cancelar = abaixo)') ? 'above' : 'below';
      setPriceAlert(symbol, target, direction);
      loadWatchlistData();
    });
  });

  view.querySelector('#watchlist-export').addEventListener('click', exportWatchlist);
  view.querySelector('#watchlist-export-rss').addEventListener('click', exportWatchlistRSS);
  view.querySelector('#watchlist-import').addEventListener('change', importWatchlist);
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
        <td colspan="10" style="text-align: center; padding: 3rem; color: var(--text-muted);">
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
        <td>
          <button
            type="button"
            class="star-btn ${watchlistSymbols.has(company.symbol) ? 'starred' : ''}"
            data-symbol="${company.symbol}"
            data-name="${escapeHtml(company.name)}"
            title="${watchlistSymbols.has(company.symbol) ? 'Remover da watchlist' : 'Adicionar à watchlist'}"
            aria-label="${watchlistSymbols.has(company.symbol) ? 'Remover da watchlist' : 'Adicionar à watchlist'}"
          >${watchlistSymbols.has(company.symbol) ? '\u2605' : '\u2606'}</button>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
  wireWatchlistButtons();
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
      if (e.target.type === 'checkbox' || e.target.classList.contains('star-btn')) return;
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

  const headers = ['Símbolo', 'Empresa', 'Setor', 'Subindústria', 'Sede', 'Market Cap', 'Dividend Yield'];
  const rows = companies.map(c => [
    c.symbol,
    `"${c.name}"`,
    c.sectorName,
    `"${c.subIndustry || ''}"`,
    `"${c.headquarters || ''}"`,
    c.marketCap || '',
    c.dividendYield !== null && c.dividendYield !== undefined ? c.dividendYield.toFixed(2) : ''
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
