import { API_BASE_URL, SECTORS } from './config.js';

export async function loadTreemap() {
  const container = document.getElementById('treemap-view');
  if (!container) return;

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.background = 'var(--bg-primary)';

  container.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando setores...</div>';

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

        return {
          id,
          name: s?.name || id,
          value: totalCap,
          companies: cos.length,
          avgDiv: parseFloat(avgDiv.toFixed(2)),
          topCompany: cos.length > 0 ? cos[0].symbol : 'N/A',
        };
      })
    );

    const totalCap = stats.reduce((a, s) => a + s.value, 0);
    const colors = [
      '#00d4ff',
      '#00e676',
      '#ffab00',
      '#ff5252',
      '#8bc34a',
      '#4caf50',
      '#2196f3',
      '#9c27b0',
      '#ff9800',
      '#f44336',
      '#00bcd4',
    ];

    let html = `
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        padding: 40px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        align-content: start;
      ">
    `;

    stats.forEach((s, i) => {
      const color = colors[i % colors.length];
      const percentage = ((s.value / totalCap) * 100).toFixed(1);
      const marketCapB = (s.value / 1e9).toFixed(1);

      html += `
        <div style="
          background: linear-gradient(135deg, ${color}22 0%, ${color}11 100%);
          border: 1px solid ${color}33;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-sizing: border-box;
        "
        onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px ${color}22'"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'"
        >
          <div>
            <div style="
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: ${color};
              font-weight: 600;
              margin-bottom: 8px;
            ">${percentage}%</div>
            <div style="
              font-size: 18px;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 4px;
            ">${s.name}</div>
            <div style="
              font-size: 13px;
              color: var(--text-secondary);
            ">${s.companies} empresas</div>
          </div>
          
          <div style="
            border-top: 1px solid ${color}22;
            padding-top: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          ">
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Market Cap</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${color};
              ">$${marketCapB}B</div>
            </div>
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Top</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: var(--text-primary);
              ">${s.topCompany}</div>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  } catch {
    container.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar setores</div>';
  }
}
