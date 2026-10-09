// ========== RESUMO DO DIA ==========
import { API_BASE_URL } from './config.js';
import { escapeHtml } from './utils.js';

const MARKET_MOOD = {
  bullish: { label: 'Otimista', cls: 'positive' },
  bearish: { label: 'Pessimista', cls: 'negative' },
  neutral: { label: 'Neutro', cls: '' },
};

export async function loadDailySummary(containerId = 'daily-summary') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p class="summary-empty">Carregando resumo do dia...</p>';

  try {
    const response = await fetch(`${API_BASE_URL}/api/resumo-dia`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    renderDailySummary(container, payload.dados || {});
  } catch (error) {
    console.error('Erro ao carregar Resumo do Dia:', error);
    container.innerHTML = '<p class="summary-empty">Resumo do dia indisponível no momento.</p>';
  }
}

export function formatPct(value) {
  const num = Number(value) || 0;
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function formatReferenceDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
}

export function renderRankList(title, items) {
  const rows = (items || [])
    .map(
      (item) => `
        <div class="summary-row">
          <span class="mini-symbol">${escapeHtml(item.symbol || '')}</span>
          <span class="mini-name">${escapeHtml(item.name || '')}</span>
          <span class="mini-change ${item.changePct >= 0 ? 'positive' : 'negative'}">${formatPct(item.changePct)}</span>
        </div>`
    )
    .join('');

  return `
    <div class="summary-list">
      <h4 class="summary-list-title">${title}</h4>
      ${rows}
    </div>`;
}

export function renderDailySummary(container, data) {
  const stats = data.stats || {};
  const mood = MARKET_MOOD[data.marketMood] || { label: '—', cls: '' };
  const referenceDate = formatReferenceDate(data.referenceDate);

  const cards = [
    { label: 'Em alta', value: stats.gainers ?? '—', cls: 'positive' },
    { label: 'Em baixa', value: stats.losers ?? '—', cls: 'negative' },
    { label: 'Estáveis', value: stats.neutral ?? '—', cls: '' },
    { label: 'Total', value: stats.total ?? '—', cls: '' },
    { label: 'Humor', value: mood.label, cls: mood.cls },
  ]
    .map(
      (card) => `
      <div class="daily-card ${card.cls}">
        <span class="daily-label">${card.label}</span>
        <span class="daily-value">${card.value}</span>
      </div>`
    )
    .join('');

  const sectors = (data.sectorPerformance || [])
    .map(
      (sector) => `
      <div class="daily-sector-card ${sector.avgChangePct >= 0 ? 'positive' : 'negative'}">
        <span class="sector-name">${escapeHtml(sector.name || '')}</span>
        <span class="sector-change">${formatPct(sector.avgChangePct)}</span>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${referenceDate ? `<span class="daily-date">Referência: ${referenceDate}</span>` : ''}
    </header>

    <div class="daily-summary-grid">${cards}</div>

    <div class="daily-lists">
      ${renderRankList('🚀 Maiores altas', data.topGainers)}
      ${renderRankList('📉 Maiores baixas', data.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${sectors}</div>
    </div>
  `;
}
