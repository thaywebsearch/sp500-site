// ========== HISTÓRICO DE PREÇOS (MODAL COM GRÁFICO SVG) ==========
import { getPriceHistory } from './api.js';
import { escapeHtml } from './utils.js';

const W = 760;
const H = 320;
const P = { top: 28, right: 28, bottom: 44, left: 68 };

function fmtDataBr(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

function fmtPreco(valor) {
  if (!Number.isFinite(valor)) return '—';
  return valor >= 100 ? `$${valor.toFixed(0)}` : `$${valor.toFixed(2)}`;
}

function buildChart(data) {
  const prices = data.map((r) => r.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const yMin = min - range * 0.08;
  const yMax = max + range * 0.08;
  const n = data.length;

  const x = (i) => P.left + (i / (n - 1)) * (W - P.left - P.right);
  const y = (valor) => P.top + (1 - (valor - yMin) / (yMax - yMin)) * (H - P.top - P.bottom);

  let html = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;

  const ticks = 5;
  for (let t = 0; t <= ticks; t++) {
    const valor = yMin + ((yMax - yMin) * t) / ticks;
    const yy = y(valor);
    html += `<line x1="${P.left}" y1="${yy.toFixed(1)}" x2="${W - P.right}" y2="${yy.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`;
    html += `<text x="${P.left - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${fmtPreco(valor)}</text>`;
  }

  const labelsIdx = [];
  for (let t = 0; t <= 4; t++) {
    labelsIdx.push(Math.round(((n - 1) * t) / 4));
  }
  labelsIdx.forEach((i) => {
    const xx = x(i);
    html += `<text x="${xx.toFixed(1)}" y="${H - P.bottom + 18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${fmtDataBr(data[i].data)}</text>`;
  });

  const points = data.map((r, i) => `${x(i).toFixed(1)},${y(r.close).toFixed(1)}`).join(' ');
  const area =
    `${P.left},${y(yMin).toFixed(1)} ` + points + ` ${x(n - 1).toFixed(1)},${y(yMin).toFixed(1)}`;

  html += `<polygon points="${area}" fill="rgba(0, 212, 255, 0.08)"/>`;
  html += `<polyline points="${points}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

  const last = data[n - 1];
  const lastY = y(last.close);
  html += `<circle cx="${x(n - 1).toFixed(1)}" cy="${lastY.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`;
  html += `<text x="${W - P.right}" y="${(lastY - 10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${fmtPreco(last.close)}</text>`;

  html += '</svg>';
  return html;
}

export async function openPriceChart(symbol, companyName) {
  document.querySelector('.modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const closeModal = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-label="Histórico de ${escapeHtml(symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${escapeHtml(symbol)}
          <span class="modal-subtitle">${escapeHtml(companyName || '')}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);

  try {
    const registros = await getPriceHistory(symbol);
    const body = overlay.querySelector('#price-chart-body');

    if (!registros || registros.length === 0) {
      body.innerHTML = `<p class="modal-error">Nenhum dado de preço disponível para ${escapeHtml(symbol)}.</p>`;
      return;
    }

    const primeiros = registros[0].close;
    const ultimos = registros[registros.length - 1].close;
    const variacao = ((ultimos - primeiros) / primeiros) * 100;
    const positivo = variacao >= 0;
    const classe = positivo ? 'positive' : 'negative';

    body.innerHTML = `
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${fmtPreco(ultimos)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${classe}">${positivo ? '+' : ''}${variacao.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${registros.length} pregões</strong>
        </div>
      </div>
      ${buildChart(registros)}
    `;
  } catch (e) {
    console.error(`Erro ao buscar histórico de ${symbol}:`, e);
    const body = overlay.querySelector('#price-chart-body');
    body.innerHTML = `<p class="modal-error">Erro ao carregar o histórico de ${escapeHtml(symbol)}. Verifique se o backend está online.</p>`;
  }
}
