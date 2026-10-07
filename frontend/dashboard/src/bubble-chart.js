export async function loadBubbleChart() {
  const container = document.getElementById('bubble-chart-view');
  if (!container) return;

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.style.background = 'var(--bg-primary)';
  container.style.overflowY = 'auto';

  container.innerHTML = '<div style="text-align:center;color:var(--text-secondary)">Carregando bubble chart...</div>';

  try {
    // Usar variáveis globais de config.js
    const res = await fetch(`${window.API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];

    let allCompanies = [];

    // Carregar todas as empresas
    for (const sectorId of setores) {
      const r = await fetch(`${window.API_BASE_URL}/api/setor/${sectorId}`);
      const d = await r.json();
      const s = window.SECTORS.find(x => x.id === sectorId);
      const companies = d.dados?.companies || [];

      companies.forEach(c => {
        allCompanies.push({
          ...c,
          sectorName: s?.name || sectorId,
          sectorId
        });
      });
    }

    // Top 30 por Market Cap
    const top30 = allCompanies
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, 30);

    let html = `
      <div>
        <h2 style="
          margin: 0 0 8px 0;
          font-size: 24px;
          color: var(--text-primary);
          font-weight: 600;
        ">🫧 Bubble Chart - Top 30 Empresas</h2>
        <p style="
          margin: 0 0 40px 0;
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Tamanho da bolha = Market Cap | Cor = Setor | Posição Y = Dividend Yield</p>
      </div>

      <div style="
        width: 100%;
        height: 600px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-bottom: 40px;
      ">
        <svg style="width: 100%; height: 100%;">
    `;

    // Cores por setor
    const sectorColors = {
      'communication-services': '#00d4ff',
      'consumer-discretionary': '#00e676',
      'consumer-staples': '#ffab00',
      'energy': '#ff5252',
      'financials': '#ba68c8',
      'health-care': '#29b6f6',
      'industrials': '#66bb6a',
      'information-technology': '#ffa726',
      'materials': '#ab47bc',
      'real-estate': '#ec407a',
      'utilities': '#26a69a'
    };

    const maxMarketCap = Math.max(...top30.map(c => c.marketCap || 0));
    const maxDividend = Math.max(...top30.map(c => c.dividendYield || 0), 5);

    top30.forEach((company, idx) => {
      const x = ((company.marketCap || 0) / maxMarketCap) * 800 + 50;
      const y = 550 - ((company.dividendYield || 0) / maxDividend) * 500;
      const radius = Math.sqrt((company.marketCap || 0) / 1e8) + 10;
      const color = sectorColors[company.sectorId] || '#00d4ff';

      html += `
        <circle
          cx="${x}"
          cy="${y}"
          r="${radius}"
          fill="${color}"
          opacity="0.6"
          stroke="var(--border)"
          stroke-width="1"
          style="cursor: pointer; transition: all 0.3s ease;"
          onmouseover="this.setAttribute('opacity', '0.9'); this.setAttribute('stroke-width', '2');"
          onmouseout="this.setAttribute('opacity', '0.6'); this.setAttribute('stroke-width', '1');"
          title="${company.symbol} - ${company.name}
Market Cap: $${(company.marketCap / 1e9).toFixed(2)}B
Dividend: ${(company.dividendYield || 0).toFixed(2)}%
Setor: ${company.sectorName}"
        />
        <text
          x="${x}"
          y="${y + 4}"
          text-anchor="middle"
          font-size="11"
          fill="var(--text-primary)"
          font-weight="700"
          pointer-events="none"
        >${company.symbol}</text>
      `;
    });

    html += `
          <!-- Eixo X (Market Cap) -->
          <line x1="50" y1="550" x2="850" y2="550" stroke="var(--border)" stroke-width="1"/>
          <text x="450" y="580" text-anchor="middle" font-size="12" fill="var(--text-secondary)">Market Cap →</text>

          <!-- Eixo Y (Dividend) -->
          <line x1="50" y1="50" x2="50" y2="550" stroke="var(--border)" stroke-width="1"/>
          <text x="20" y="300" text-anchor="middle" font-size="12" fill="var(--text-secondary)" transform="rotate(-90 20 300)">Dividend Yield →</text>
        </svg>
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 40px;
      ">
    `;

    // Legenda de cores por setor
    window.SECTORS.forEach(sector => {
      const color = sectorColors[sector.id] || '#00d4ff';
      const count = top30.filter(c => c.sectorId === sector.id).length;
      
      if (count > 0) {
        html += `
          <div style="
            padding: 12px;
            background: rgba(26, 26, 46, 0.5);
            border: 1px solid var(--border);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background: ${color};
              border-radius: 50%;
              flex-shrink: 0;
            "></div>
            <div>
              <div style="font-size: 12px; color: var(--text-primary); font-weight: 600;">
                ${sector.name}
              </div>
              <div style="font-size: 10px; color: var(--text-secondary);">
                ${count} empresa${count > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        `;
      }
    });

    html += `
      </div>

      <div style="
        padding: 20px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">💡 Como Ler o Bubble Chart:</h3>
        <ul style="
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.8;
        ">
          <li><strong>Tamanho da Bolha:</strong> Market Cap (maior = mais valioso)</li>
          <li><strong>Posição Horizontal:</strong> Market Cap (à direita = maior)</li>
          <li><strong>Posição Vertical:</strong> Dividend Yield (acima = maior dividendo)</li>
          <li><strong>Cor:</strong> Representa o setor da empresa</li>
        </ul>
      </div>
    `;

    container.innerHTML = html;

  } catch (error) {
    console.error('Erro ao carregar bubble chart:', error);
    container.innerHTML = `
      <div style="
        text-align: center;
        color: var(--accent-red);
        padding: 40px;
      ">
        ❌ Erro ao carregar bubble chart
        <div style="
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 10px;
        ">${error.message}</div>
      </div>
    `;
  }
}
