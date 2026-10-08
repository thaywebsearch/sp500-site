export async function loadHeatmap() {
  const container = document.getElementById('heatmap-view');
  if (!container) return;

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.style.background = 'var(--bg-primary)';
  container.style.overflowY = 'auto';

  container.innerHTML =
    '<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';

  try {
    // Usar variáveis globais de config.js
    const res = await fetch(`${window.API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];

    let html = `
      <div>
        <h2 style="
          margin: 0 0 8px 0;
          font-size: 24px;
          color: var(--text-primary);
          font-weight: 600;
        ">🔥 Heatmap - Top 4 Empresas por Setor</h2>
        <p style="
          margin: 0 0 40px 0;
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Market Cap e Dividend Yield dos líderes de cada setor</p>
      </div>
    `;

    // Carregar dados de cada setor
    for (const sectorId of setores) {
      const r = await fetch(`${window.API_BASE_URL}/api/setor/${sectorId}`);
      const d = await r.json();
      const s = window.SECTORS.find((x) => x.id === sectorId);
      const companies = d.dados?.companies || [];

      if (companies.length === 0) continue;

      // Top 4 por Market Cap
      const top4 = companies.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, 4);

      html += `
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${s?.name || sectorId}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `;

      top4.forEach((company, idx) => {
        const marketCap = (company.marketCap / 1e9).toFixed(2);
        const dividend = (company.dividendYield || 0).toFixed(2);

        // Cor baseada em Market Cap
        let color = '#4caf50';
        if (marketCap > 500) color = '#ff5252';
        else if (marketCap > 200) color = '#ff9800';
        else if (marketCap > 100) color = '#ffeb3b';
        else if (marketCap > 50) color = '#8bc34a';

        html += `
          <div style="
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.borderColor='${color}';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%)';this.style.transform='translateY(0)'"
          >
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            ">
              <div style="
                font-size: 14px;
                font-weight: 700;
                color: var(--text-primary);
              ">${company.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${color}22;
                color: ${color};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">
                #${idx + 1}
              </div>
            </div>

            <div style="
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 12px;
              word-break: break-word;
            ">
              ${company.name}
            </div>

            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            ">
              <div style="
                padding: 8px;
                background: rgba(0, 212, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.1);
                border-radius: 6px;
              ">
                <div style="
                  font-size: 9px;
                  color: var(--text-secondary);
                  text-transform: uppercase;
                  margin-bottom: 4px;
                ">Market Cap</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: ${color};
                ">$${marketCap}B</div>
              </div>

              <div style="
                padding: 8px;
                background: rgba(0, 212, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.1);
                border-radius: 6px;
              ">
                <div style="
                  font-size: 9px;
                  color: var(--text-secondary);
                  text-transform: uppercase;
                  margin-bottom: 4px;
                ">Dividend</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: var(--accent-green);
                ">${dividend}%</div>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    html += `
      <div style="
        padding: 20px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
        margin-top: 40px;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">💡 Como Ler Este Heatmap:</h3>
        <p style="
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.8;
        ">
          Este gráfico mostra os 4 maiores líderes por Market Cap em cada setor do SP500.
          <br>As cores indicam o tamanho do Market Cap: <strong style="color: #ff5252;">Vermelho = Muito Grande</strong>,
          <strong style="color: #ff9800;">Laranja = Grande</strong>,
          <strong style="color: #ffeb3b;">Amarelo = Médio</strong>,
          <strong style="color: #8bc34a;">Verde = Pequeno</strong>.
        </p>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Erro ao carregar heatmap:', error);
    container.innerHTML = `
      <div style="
        text-align: center;
        color: var(--accent-red);
        padding: 40px;
      ">
        ❌ Erro ao carregar heatmap
        <div style="
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 10px;
        ">${error.message}</div>
      </div>
    `;
  }
}
