// Configuração da API
const API_BASE_URL_HEAT = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://sp500-site-production.up.railway.app';

const SECTORS_HEAT = [
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

let selectedMetricHeat = 'marketCap';

async function loadHeatmap() {
  const container = document.getElementById('heatmap-view');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando heatmap...</p></div>';

  try {
    const setoresResponse = await fetch(`${API_BASE_URL_HEAT}/api/setores`);
    const setoresData = await setoresResponse.json();
    const setores = setoresData.setores || [];

    const sectorStats = await Promise.all(
      setores.map(async (setorId) => {
        try {
          const response = await fetch(`${API_BASE_URL_HEAT}/api/setor/${setorId}`);
          const sectorData = await response.json();
          
          const sector = SECTORS_HEAT.find(s => s.id === setorId);
          const companies = sectorData.dados?.companies || [];
          
          const totalMarketCap = companies.reduce((sum, c) => sum + (c.marketCap || 0), 0);
          const avgDividend = companies.length > 0 
            ? companies.reduce((sum, c) => sum + (c.dividendYield || 0), 0) / companies.length
            : 0;
          const companiesWithDividend = companies.filter(c => c.hasDividend === 'Sim').length;

          return {
            id: setorId,
            name: sector?.name || setorId,
            marketCap: totalMarketCap,
            companies: companies.length,
            avgDividend: parseFloat(avgDividend.toFixed(2)),
            companiesWithDividend: companiesWithDividend,
            topCompany: companies.length > 0 ? companies[0].symbol : 'N/A',
          };
        } catch (error) {
          console.error(`Erro ao carregar ${setorId}:`, error);
          return null;
        }
      })
    );

    const validStats = sectorStats.filter(s => s !== null);
    renderHeatmap(validStats);
  } catch (error) {
    console.error('Erro ao carregar heatmap:', error);
    container.innerHTML = '<div class="loading"><p>Erro ao carregar dados</p></div>';
  }
}

function getColorIntensity(value, max) {
  const percentage = (value / max) * 100;
  if (percentage >= 80) return '#ff5252';
  if (percentage >= 60) return '#ff9800';
  if (percentage >= 40) return '#ffeb3b';
  if (percentage >= 20) return '#8bc34a';
  return '#4caf50';
}

function renderHeatmap(data) {
  const container = document.getElementById('heatmap-view');

  const maxMarketCap = Math.max(...data.map(s => s.marketCap)) / 1e9;
  const maxCompanies = Math.max(...data.map(s => s.companies));
  const maxDividend = Math.max(...data.map(s => s.avgDividend));
  const maxDividendCompanies = Math.max(...data.map(s => s.companiesWithDividend));

  let html = `
    <div class="heatmap-container">
      <div class="heatmap-header">
        <h2>🔥 Heatmap de Setores - SP500</h2>
        <p class="subtitle">Visualização interativa de métricas por setor</p>
      </div>

      <div class="heatmap-controls">
        <label>Selecionar Métrica:</label>
        <div class="metric-buttons">
          <button class="metric-btn active" onclick="changeMetricHeat('marketCap')">💰 Market Cap</button>
          <button class="metric-btn" onclick="changeMetricHeat('companies')">🏢 Empresas</button>
          <button class="metric-btn" onclick="changeMetricHeat('avgDividend')">📈 Dividend Yield</button>
          <button class="metric-btn" onclick="changeMetricHeat('dividendCompanies')">💵 Com Dividendo</button>
        </div>
      </div>

      <div class="heatmap-grid">
        <div class="heatmap-header-row">
          <div class="heatmap-cell header">Setor</div>
          <div class="heatmap-cell header">Market Cap</div>
          <div class="heatmap-cell header">Empresas</div>
          <div class="heatmap-cell header">Avg Div</div>
          <div class="heatmap-cell header">Com Div</div>
        </div>
  `;

  data.forEach((sector) => {
    html += `
      <div class="heatmap-row">
        <div class="heatmap-cell sector-name">${sector.name}</div>
        <div class="heatmap-cell metric-cell" style="${selectedMetricHeat === 'marketCap' ? `background-color: ${getColorIntensity(sector.marketCap / 1e9, maxMarketCap)}; opacity: 0.7; color: white; font-weight: bold;` : ''}">
          $${(sector.marketCap / 1e9).toFixed(1)}B
        </div>
        <div class="heatmap-cell metric-cell" style="${selectedMetricHeat === 'companies' ? `background-color: ${getColorIntensity(sector.companies, maxCompanies)}; opacity: 0.7; color: white; font-weight: bold;` : ''}">
          ${sector.companies}
        </div>
        <div class="heatmap-cell metric-cell" style="${selectedMetricHeat === 'avgDividend' ? `background-color: ${getColorIntensity(sector.avgDividend, maxDividend)}; opacity: 0.7; color: white; font-weight: bold;` : ''}">
          ${sector.avgDividend.toFixed(2)}%
        </div>
        <div class="heatmap-cell metric-cell" style="${selectedMetricHeat === 'dividendCompanies' ? `background-color: ${getColorIntensity(sector.companiesWithDividend, maxDividendCompanies)}; opacity: 0.7; color: white; font-weight: bold;` : ''}">
          ${sector.companiesWithDividend} / ${sector.companies}
        </div>
      </div>
    `;
  });

  html += `
      </div>

      <div class="heatmap-legend">
        <h3>Legenda de Intensidade</h3>
        <div class="legend-scale">
          <div class="legend-item">
            <div class="legend-box" style="background-color: #4caf50;"></div>
            <span>Baixo (&lt;20%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-box" style="background-color: #8bc34a;"></div>
            <span>Baixo-Médio (20-40%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-box" style="background-color: #ffeb3b;"></div>
            <span>Médio (40-60%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-box" style="background-color: #ff9800;"></div>
            <span>Alto (60-80%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-box" style="background-color: #ff5252;"></div>
            <span>Muito Alto (&gt;80%)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function changeMetricHeat(metric) {
  selectedMetricHeat = metric;
  // Atualiza botões
  document.querySelectorAll('.metric-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Recarrega o heatmap (você pode otimizar isso depois)
  loadHeatmap();
}

