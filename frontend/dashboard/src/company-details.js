// ========== DETALHES DA EMPRESA (MODAL) ==========
import { formatMarketCap, escapeHtml } from './utils.js';
import { openPriceChart } from './price-chart.js';

function detailItem(label, valor) {
  return `
    <div class="company-detail">
      <span class="company-detail-label">${label}</span>
      <strong class="company-detail-value">${valor}</strong>
    </div>
  `;
}

export function openCompanyDetails(company) {
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

  const dividendYield =
    company.dividendYield !== null && company.dividendYield !== undefined
      ? `${company.dividendYield.toFixed(2)}%`
      : '—';
  const marketCap = formatMarketCap(company.marketCap);

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-label="Detalhes de ${escapeHtml(company.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${escapeHtml(company.symbol)}
          <span class="modal-subtitle">${escapeHtml(company.name || '')}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${detailItem('Empresa', escapeHtml(company.name || 'N/A'))}
          ${detailItem('Setor', escapeHtml(company.sectorName || company.sector || 'N/A'))}
          ${detailItem('Subindústria', escapeHtml(company.subIndustry || 'N/A'))}
          ${detailItem('Sede', escapeHtml(company.headquarters || 'N/A'))}
          ${detailItem('Market Cap', marketCap)}
          ${detailItem('Classificação', escapeHtml(company.marketCapClassification || 'N/A'))}
          ${detailItem('Div. Yield', dividendYield)}
          ${detailItem('Paga dividendos', company.hasDividend ? escapeHtml(company.hasDividend) : '—')}
          ${detailItem('Data de inclusão', escapeHtml(company.dateAdded || 'N/A'))}
          ${detailItem('CIK', company.cik ? escapeHtml(String(company.cik)) : 'N/A')}
          ${detailItem('Fundação', escapeHtml(company.founded || 'N/A'))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.querySelector('#details-chart-btn').addEventListener('click', () => {
    openPriceChart(company.symbol, company.name);
  });
}
