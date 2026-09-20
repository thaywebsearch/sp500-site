import { getAllSectorData } from './api.js';

export async function loadBubbleChart() {
  const container = document.getElementById('bubble-chart-view');
  if (!container) return;

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.background = 'var(--bg-primary)';

  container.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando bubble chart...</div>';

  try {
    const stats = (await getAllSectorData()).map((sector) => {
      const cos = sector.companies;
      const totalCap = cos.reduce((a, c) => a + (c.marketCap || 0), 0);
      const avgDiv =
        cos.length > 0 ? cos.reduce((a, c) => a + (c.dividendYield || 0), 0) / cos.length : 0;

      return {
        id: sector.id,
        name: sector.name,
        cap: (totalCap / 1e9).toFixed(1),
        companies: cos.length,
        avgDiv: parseFloat(avgDiv.toFixed(2)),
        topCompany: cos.length > 0 ? cos[0].symbol : 'N/A',
      };
    });

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

    const maxCap = Math.max(...stats.map((s) => parseFloat(s.cap)));
    const maxCompanies = Math.max(...stats.map((s) => s.companies));

    let bubbleHTML =
      '<svg viewBox="0 0 1000 600" style="width:100%;height:100%;border-radius:8px;background:var(--plot-bg)">';

    // Eixos
    bubbleHTML +=
      '<line x1="80" y1="550" x2="950" y2="550" stroke="var(--chart-axis)" stroke-width="2"/>';
    bubbleHTML +=
      '<line x1="80" y1="550" x2="80" y2="50" stroke="var(--chart-axis)" stroke-width="2"/>';

    // Labels dos eixos
    bubbleHTML +=
      '<text x="500" y="590" text-anchor="middle" font-size="12" fill="var(--chart-label)">Market Cap (B$)</text>';
    bubbleHTML +=
      '<text x="30" y="300" text-anchor="middle" font-size="12" fill="var(--chart-label)" transform="rotate(-90 30 300)">Empresas</text>';

    // Grid
    for (let i = 0; i <= 5; i++) {
      const x = 80 + i * 174;
      const y = 550 - i * 100;
      bubbleHTML += `<line x1="${x}" y1="545" x2="${x}" y2="555" stroke="var(--chart-axis)" stroke-width="1"/>`;
      bubbleHTML += `<line x1="75" y1="${y}" x2="85" y2="${y}" stroke="var(--chart-axis)" stroke-width="1"/>`;
      bubbleHTML += `<text x="${x}" y="570" text-anchor="middle" font-size="10" fill="var(--chart-label)">$${((i * maxCap) / 5).toFixed(0)}B</text>`;
      bubbleHTML += `<text x="60" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--chart-label)">${Math.round((i * maxCompanies) / 5)}</text>`;
    }

    // Bolhas
    stats.forEach((s, idx) => {
      const color = colors[idx % colors.length];
      const x = 80 + (parseFloat(s.cap) / maxCap) * 870;
      const y = 550 - (s.companies / maxCompanies) * 500;
      const radius = Math.max(15, (parseFloat(s.cap) / maxCap) * 60);

      bubbleHTML += `
        <circle 
          cx="${x}" cy="${y}" r="${radius}" 
          fill="${color}44" stroke="${color}" stroke-width="2"
          style="cursor:pointer;transition:all 0.3s ease"
          onmouseover="this.setAttribute('r', '${radius * 1.2}');this.setAttribute('fill', '${color}66')"
          onmouseout="this.setAttribute('r', '${radius}');this.setAttribute('fill', '${color}44')"
          data-sector="${s.name}"
          data-cap="${s.cap}"
          data-companies="${s.companies}"
          data-div="${s.avgDiv}"
        />
        <text x="${x}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="600" fill="${color}" style="pointer-events:none">${s.name.split(' ')[0]}</text>
        <text x="${x}" y="${y + 8}" text-anchor="middle" font-size="11" fill="var(--chart-text)" style="pointer-events:none">$${s.cap}B</text>
      `;
    });

    bubbleHTML += '</svg>';

    let html = `
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        gap: 40px;
      ">
        <div>
          <h2 style="
            margin: 0 0 8px 0;
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
          ">🫧 Bubble Chart 3D - SP500</h2>
          <p style="
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Eixo X: Market Cap | Eixo Y: Nº de Empresas | Tamanho: Proporção de Peso</p>
        </div>

        <div style="
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          padding: 20px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${bubbleHTML}
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        ">
    `;

    stats.forEach((s, idx) => {
      const color = colors[idx % colors.length];
      const capPct = ((parseFloat(s.cap) / maxCap) * 100).toFixed(1);
      const compPct = ((s.companies / maxCompanies) * 100).toFixed(1);

      html += `
        <div style="
          background: linear-gradient(135deg, ${color}22 0%, ${color}11 100%);
          border: 1px solid ${color}33;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="
          this.style.borderColor='${color}';
          this.style.background='linear-gradient(135deg, ${color}33 0%, ${color}22 100%)';
          this.style.transform='translateY(-4px)';
          this.style.boxShadow='0 12px 32px ${color}22';
        "
        onmouseout="
          this.style.borderColor='${color}33';
          this.style.background='linear-gradient(135deg, ${color}22 0%, ${color}11 100%)';
          this.style.transform='translateY(0)';
          this.style.boxShadow='none';
        "
        >
          <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background: ${color};
              border-radius: 50%;
              flex-shrink: 0;
            "></div>
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
            ">${s.name}</div>
          </div>

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
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
                font-size: 18px;
                font-weight: 700;
                color: ${color};
              ">$${s.cap}B</div>
              <div style="
                font-size: 10px;
                color: var(--text-secondary);
                margin-top: 4px;
              ">${capPct}% do máximo</div>
            </div>

            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Empresas</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
              ">${s.companies}</div>
              <div style="
                font-size: 10px;
                color: var(--text-secondary);
                margin-top: 4px;
              ">${compPct}% do máximo</div>
            </div>
          </div>

          <div style="
            border-top: 1px solid ${color}22;
            padding-top: 12px;
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
              ">Avg Dividend</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${color};
              ">${s.avgDiv}%</div>
            </div>

            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Top Company</div>
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

    html += `
        </div>

        <div style="
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
        ">
          <h3 style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">💡 Como Ler</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
          ">
            <div>
              <strong style="color: var(--accent-cyan)">Eixo X (Horizontal):</strong> Representa o Market Cap de cada setor. Setores mais à direita têm maior capitalização de mercado.
            </div>
            <div>
              <strong style="color: var(--accent-green)">Eixo Y (Vertical):</strong> Representa o número de empresas em cada setor. Setores mais acima têm mais empresas.
            </div>
            <div>
              <strong style="color: var(--accent-amber)">Tamanho da Bolha:</strong> Quanto maior a bolha, maior o peso relativo do setor no índice SP500.
            </div>
            <div>
              <strong style="color: var(--text-primary)">Hover Interativo:</strong> Passe o mouse sobre as bolhas e cards para ver mais detalhes e animações.
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch {
    container.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar bubble chart</div>';
  }
}
