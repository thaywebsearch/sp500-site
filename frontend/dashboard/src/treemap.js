// Configuração da API
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

async function loadTreemap() {
  const container = document.getElementById('treemap-view');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando treemap...</p></div>';

  try {
    const setoresResponse = await fetch(`${API_BASE_URL}/api/setores`);
    const setoresData = await setoresResponse.json();
    const setores = setoresData.setores || [];

    const sectorStats = await Promise.all(
      setores.map(async (setorId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/setor/${setorId}`);
          const sectorData = await response.json();
          
          const sector = SECTORS.find(s => s.id === setorId);
          const companies = sectorData.dados?.companies || [];
          
          const totalMarketCap = companies.reduce((sum, c) => sum + (c.marketCap || 0), 0);
          const avgDividend = companies.length > 0 
            ? companies.reduce((sum, c) => sum + (c.dividendYield || 0), 0) / companies.length
            : 0;

          return {
            name: sector?.name || setorId,
            value: totalMarketCap,
            companies: companies.length,
            avgDividend: parseFloat(avgDividend.toFixed(2)),
            topCompany: companies.length > 0 ? companies[0].symbol : 'N/A',
          };
        } catch (error) {
          console.error(`Erro ao carregar ${setorId}:`, error);
          return null;
        }
      })
    );

    const validStats = sectorStats.filter(s => s !== null);
    const totalCap = validStats.reduce((sum, s) => sum + s.value, 0);

    const dataWithPercentage = validStats.map(s => ({
      ...s,
      percentage: ((s.value / totalCap) * 100).toFixed(2),
    }));

    renderTreemap(dataWithPercentage, totalCap);
  } catch (error) {
    console.error('Erro ao carregar treemap:', error);
    container.innerHTML = '<div class="loading"><p>Erro ao carregar dados</p></div>';
  }
}

function renderTreemap(data, totalCap) {
  const container = document.getElementById('treemap-view');
  
  let html = `
    <div class="treemap-container">
      <div class="treemap-header">
        <h2>🗺️ Mapa de Setores - SP500</h2>
        <p class="subtitle">Market Cap por Setor | Tamanho = Peso no índice</p>
      </div>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Market Cap Total</span>
          <span class="stat-value">$${(totalCap / 1e12).toFixed(2)}T</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior Setor</span>
          <span class="stat-value">${data.reduce((max, s) => s.value > max.value ? s : max).name}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Setores Analisados</span>
          <span class="stat-value">${data.length}</span>
        </div>
      </div>

      <div class="treemap-chart">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; padding: 20px;">
  `;

  // Renderiza retângulos coloridos
  data.forEach((sector, idx) => {
    const colors = ['#00d4ff', '#00e676', '#ffab00', '#ff5252', '#8bc34a', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#00bcd4'];
    const color = colors[idx % colors.length];
    const height = (sector.value / Math.max(...data.map(s => s.value))) * 200 + 100;

    html += `
      <div style="
        background: ${color};
        border-radius: 8px;
        padding: 15px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: ${height}px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      " onmouseover="this.style.opacity='0.8'; this.style.transform='scale(1.05)'" onmouseout="this.style.opacity='1'; this.style.transform='scale(1)'">
        <div style="font-weight: bold; margin-bottom: 10px;">${sector.name}</div>
        <div>$${(sector.value / 1e9).toFixed(1)}B</div>
        <div style="font-size: 0.9em; margin-top: 5px;">${sector.percentage}% do SP500</div>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <div class="treemap-legend">
        <h3>Detalhes por Setor</h3>
        <div class="legend-grid">
  `;

  data.forEach((sector, idx) => {
    const colors = ['#00d4ff', '#00e676', '#ffab00', '#ff5252', '#8bc34a', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#00bcd4'];
    const color = colors[idx % colors.length];

    html += `
      <div class="legend-item">
        <div class="legend-color" style="background-color: ${color};"></div>
        <div class="legend-info">
          <div class="legend-name">${sector.name}</div>
          <div class="legend-details">
            $${(sector.value / 1e9).toFixed(1)}B • ${sector.companies} empresas • ${sector.percentage}%
          </div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

