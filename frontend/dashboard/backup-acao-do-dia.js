// ============================================================================
// BACKUP: FUNCIONALIDADE "AÇÃO DO DIA" E WATCHLIST
// Arquivo original: src/main.js
// Data do backup: 2026-10-07
// ============================================================================

// ============================================================================
// VARIÁVEIS GLOBAIS (referenciadas pelas funções abaixo)
// ============================================================================
let allCompanies = [];
let filteredCompanies = [];
let currentTab = 'dashboard';
const WATCHLIST_STORAGE_KEY = 'sp500-watchlist';
const PRICE_ALERTS_STORAGE_KEY = 'sp500-price-alerts';
const watchlistSymbols = new Set(loadWatchlist());
const priceAlerts = new Map(loadPriceAlerts());

// Elementos DOM
let stockOfDayView, watchlistView;

// ============================================================================
// FUNÇÕES DE PERSISTÊNCIA (Watchlist & Price Alerts)
// ============================================================================

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

function saveWatchlist() {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...watchlistSymbols]));
  } catch (err) {
    console.warn('Erro ao salvar watchlist:', err);
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

// ============================================================================
// WATCHLIST FUNCTIONS
// ============================================================================

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

function updateWatchlistCountBadge() {
  const badge = document.querySelector('[data-watchlist-count]');
  if (badge) {
    badge.textContent = watchlistSymbols.size;
    console.log(`🌟 Watchlist atualizada: ${watchlistSymbols.size} empresas`);
  }
}

function updateWatchlistStars() {
  document.querySelectorAll('.btn-watchlist').forEach(btn => {
    const active = watchlistSymbols.has(btn.dataset.symbol);
    btn.textContent = active ? '★' : '☆';
    btn.title = active ? 'Remover da watchlist' : 'Adicionar à watchlist';
  });
}

async function loadWatchlistData() {
  const watchlistView = document.getElementById('watchlist-view');
  if (!watchlistView) return;

  if (watchlistSymbols.size === 0) {
    watchlistView.innerHTML = '<p>Nenhuma empresa na watchlist.</p>';
    return;
  }

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
      <td>${c.dividendYield || 'N/A'}</td>
      <td>${c.marketCap || 'N/A'}</td>
    </tr>`;
  });
  html += '</tbody></table>';

  watchlistView.innerHTML = html;
}

// ============================================================================
// AÇÃO DO DIA (STOCK OF DAY)
// ============================================================================

async function loadStockOfDay() {
  const stockOfDayView = document.getElementById('stock-of-day-view');
  if (!stockOfDayView) return;

  if (allCompanies.length === 0) {
    stockOfDayView.innerHTML = '<p>Nenhum dado disponível.</p>';
    return;
  }

  // Ordenar por dividend yield
  const topDividends = [...allCompanies]
    .sort((a, b) => (parseFloat(b.dividendYield) || 0) - (parseFloat(a.dividendYield) || 0))
    .slice(0, 10);

  let html = '<div class="stock-of-day"><h2>🎯 Ação do Dia - Maiores Dividend Yields</h2><table class="stats-table"><thead><tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Dividend Yield</th></tr></thead><tbody>';
  
  topDividends.forEach((c, idx) => {
    html += `<tr>
      <td>${idx + 1}</td>
      <td><strong>${c.symbol}</strong></td>
      <td>${c.name}</td>
      <td>${c.sectorName || 'N/A'}</td>
      <td>${c.dividendYield ? parseFloat(c.dividendYield).toFixed(2) + '%' : 'N/A'}</td>
    </tr>`;
  });
  
  html += '</tbody></table></div>';

  const stockOfDayView = document.getElementById('stock-of-day-view');
  if (stockOfDayView) stockOfDayView.innerHTML = html;
}

// ============================================================================
// PRICE ALERTS (estrutura base)
// ============================================================================

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

// ============================================================================
// EXPORTAÇÃO DE DADOS
// ============================================================================

function exportCSV() {
  const headers = ['#', 'Símbolo', 'Empresa', 'Setor', 'Market Cap', 'Subindústria', 'Sede', 'Dividend Yield'];
  const rows = filteredCompanies.map((c, idx) => [
    idx + 1,
    c.symbol,
    c.name,
    c.sectorName,
    c.marketCap,
    c.subindustry || c.industry || 'N/A',
    c.location || c.country || 'N/A',
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

// ============================================================================
// HTML NECESSÁRIO (index.html)
// ============================================================================
/*
<!-- Ação do Dia View -->
<div id="stock-of-day-view" style="display: none"></div>

<!-- Watchlist View -->
<div id="watchlist-view" style="display: none"></div>
*/

/*
// Na navegação (updateUI):
if (currentTab === 'stock-of-day') {
  if (stockOfDayView) stockOfDayView.style.display = 'block';
  loadStockOfDay();
} else if (currentTab === 'watchlist') {
  if (watchlistView) watchlistView.style.display = 'block';
  loadWatchlistData();
}
*/

// ============================================================================
// DEPENDÊNCIAS NECESSÁRIAS
// ============================================================================
/*
// main.js deve importar:
import { getPriceHistory } from './api.js';
import { loadWatchlistData, loadStockOfDay } from './main.js'; // ou definir inline

// api.js deve exportar:
export function getPriceHistory(symbol) { ... }

// index.html precisa ter:
/*
<div id="stock-of-day-view" style="display: none"></div>
<div id="watchlist-view" style="display: none"></div>
*/

// CSS necessário (dashboard.css):
/*
.stock-of-day { padding: 20px; }
.stats-table { width: 100%; border-collapse: collapse; }
.stats-table th, .stats-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
.stats-table th { background: var(--bg-secondary); color: var(--accent-cyan); }
.watchlist-table { width: 100%; border-collapse: collapse; }
.watchlist-table th, .watchlist-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
*/
*/

console.log('✅ Backup "Ação do Dia" e Watchlist salvo com sucesso!');