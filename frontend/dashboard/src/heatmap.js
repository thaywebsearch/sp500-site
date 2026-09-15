import { API_BASE_URL, SECTORS } from './config.js';

export async function loadHeatmap() {
  const container = document.getElementById('heatmap-view');
  if (!container) return;

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.background = 'var(--bg-primary)';

  container.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando heatmap...</div>';

  try {
    const res = await fetch(`${API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];

    const stats = await Promise.all(
      setores.map(async (id) => {
        const r = await fetch(`${API_BASE_URL}/api/setor/${id}`);
        const d = await r.json();
        const s = SECTORS.find((x) => x.id === id);
        const cos = d.dados?.companies || [];
        const totalCap = cos.reduce((a, c) => a + (c.marketCap || 0), 0);
        const avgDiv =
          cos.length > 0 ? cos.reduce((a, c) => a + (c.dividendYield || 0), 0) / cos.length : 0;
        const withDiv = cos.filter((c) => c.hasDividend === 'Sim').length;

        return {
          name: s?.name || id,
          cap: (totalCap / 1e9).toFixed(1),
          companies: cos.length,
          avgDiv: parseFloat(avgDiv.toFixed(2)),
          withDiv: withDiv,
        };
      })
    );

    function getColor(value, max) {
      const pct = (value / max) * 100;
      if (pct >= 80) return '#ff5252';
      if (pct >= 60) return '#ff9800';
      if (pct >= 40) return '#ffeb3b';
      if (pct >= 20) return '#8bc34a';
      return '#4caf50';
    }

    const maxCap = Math.max(...stats.map((s) => parseFloat(s.cap)));
    const maxDiv = Math.max(...stats.map((s) => s.avgDiv));
    const maxCompanies = Math.max(...stats.map((s) => s.companies));

    let html = `
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
      ">
        <div style="
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        ">
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
          ">Setor</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Market Cap (B)</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Empresas</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Avg Div %</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Com Div</div>
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 12px;
          flex: 1;
        ">
    `;

    stats.forEach((s) => {
      const capColor = getColor(parseFloat(s.cap), maxCap);
      const compColor = getColor(s.companies, maxCompanies);
      const divColor = getColor(s.avgDiv, maxDiv);
      const withDivColor = getColor(s.withDiv, s.companies);

      html += `
        <div style="
          padding: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.borderColor='var(--accent-cyan)';this.style.background='rgba(0,212,255,0.05)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)'"
        >${s.name}</div>
        
        <div style="
          padding: 16px;
          background: ${capColor}22;
          border: 1px solid ${capColor}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${capColor};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${capColor}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >$${s.cap}</div>
        
        <div style="
          padding: 16px;
          background: ${compColor}22;
          border: 1px solid ${compColor}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${compColor};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${compColor}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${s.companies}</div>
        
        <div style="
          padding: 16px;
          background: ${divColor}22;
          border: 1px solid ${divColor}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${divColor};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${divColor}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${s.avgDiv}%</div>
        
        <div style="
          padding: 16px;
          background: ${withDivColor}22;
          border: 1px solid ${withDivColor}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${withDivColor};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${withDivColor}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${s.withDiv}/${s.companies}</div>
      `;
    });

    html += `
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid var(--border);
        ">
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #4caf50; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Baixo (&lt;20%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #8bc34a; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Baixo-Médio (20-40%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ffeb3b; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Médio (40-60%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ff9800; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Alto (60-80%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ff5252; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Muito Alto (&gt;80%)</div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch {
    container.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar heatmap</div>';
  }
}
