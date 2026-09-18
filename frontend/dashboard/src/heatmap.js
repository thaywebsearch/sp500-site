async function loadHeatmap() {
  const container = document.getElementById('heatmap-view');
  if (!container) return;
  
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.background = 'var(--bg-primary)';
  
  container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando heatmap...</div>';

  try {
    const res = await fetch(`${API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];
    
    const sectorData = await Promise.all(setores.map(async (id) => {
      const r = await fetch(`${API_BASE_URL}/api/setor/${id}`);
      const d = await r.json();
      const s = SECTORS.find(x => x.id === id);
      const cos = d.dados?.companies || [];
      
      // Top 4 empresas por Market Cap
      const top4 = cos
        .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
        .slice(0, 4);
      
      return { 
        name: s?.name || id,
        companies: top4
      };
    }));

    function getHeatColor(value, max) {
      const pct = (value / max) * 100;
      if (pct >= 80) return '#ff5252';
      if (pct >= 60) return '#ff9800';
      if (pct >= 40) return '#ffeb3b';
      if (pct >= 20) return '#8bc34a';
      return '#4caf50';
    }

    // Encontra o maior Market Cap para normalizar cores
    let maxCap = 0;
    sectorData.forEach(sector => {
      sector.companies.forEach(company => {
        if (company.marketCap > maxCap) maxCap = company.marketCap;
      });
    });

    let html = `
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        gap: 24px;
      ">
        <div>
          <h2 style="
            margin: 0 0 8px 0;
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
          ">🔥 Heatmap - Top 4 Empresas por Setor</h2>
          <p style="
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Market Cap | Cores indicam força relativa do mercado</p>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 20px;
          flex: 1;
        ">
    `;

    sectorData.forEach((sector) => {
      html += `
        <div style="
          padding: 20px;
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          word-wrap: break-word;
          min-height: 160px;
        "
        onmouseover="this.style.borderColor='var(--accent-cyan)';this.style.background='rgba(0,212,255,0.05)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.background='rgba(26, 26, 46, 0.5)'"
        >${sector.name}</div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          align-content: start;
        ">
      `;

      sector.companies.forEach((company) => {
        const color = getHeatColor(company.marketCap, maxCap);
        const capB = (company.marketCap / 1e9).toFixed(2);
        const dividend = company.dividendYield !== null && company.dividendYield !== undefined 
          ? company.dividendYield.toFixed(2) 
          : '—';

        html += `
          <div style="
            background: ${color}22;
            border: 1px solid ${color}44;
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
            min-height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
          onmouseover="
            this.style.borderColor='${color}';
            this.style.background='${color}44';
            this.style.transform='translateY(-4px)';
            this.style.boxShadow='0 12px 32px ${color}33';
          "
          onmouseout="
            this.style.borderColor='${color}44';
            this.style.background='${color}22';
            this.style.transform='translateY(0)';
            this.style.boxShadow='none';
          "
          title="${company.name}"
          >
            <div>
              <div style="
                font-size: 13px;
                font-weight: 700;
                color: ${color};
                margin-bottom: 4px;
              ">${company.symbol}</div>
              <div style="
                font-size: 11px;
                color: var(--text-secondary);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">${company.name}</div>
            </div>

            <div style="
              border-top: 1px solid ${color}33;
              padding-top: 12px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-top: 12px;
            ">
              <div>
                <div style="
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: var(--text-secondary);
                  margin-bottom: 3px;
                ">Market Cap</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: ${color};
                ">\$${capB}B</div>
              </div>
              <div>
                <div style="
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: var(--text-secondary);
                  margin-bottom: 3px;
                ">Div %</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: var(--text-primary);
                ">${dividend}</div>
              </div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
        </div>

        <div style="
          padding: 24px;
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid var(--border);
          border-radius: 12px;
        ">
          <h3 style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">📊 Legenda de Cores</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            font-size: 12px;
            color: var(--text-secondary);
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #4caf50; border-radius: 4px;"></div>
              <span>Baixo (&lt;20%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #8bc34a; border-radius: 4px;"></div>
              <span>Baixo-Médio (20-40%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ffeb3b; border-radius: 4px;"></div>
              <span>Médio (40-60%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ff9800; border-radius: 4px;"></div>
              <span>Alto (60-80%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ff5252; border-radius: 4px;"></div>
              <span>Muito Alto (&gt;80%)</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    
  } catch (e) { 
    console.error('Erro:', e);
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar heatmap</div>';
  }
}
