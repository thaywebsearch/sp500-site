// ========== BUBBLE CHART MODULE ==========

// Cores para os setores (paleta harmônica)
const SECTOR_COLORS = {
  Energy: '#FF6B6B',
  Materials: '#C92A2A',
  Industrials: '#FFA94D',
  'Consumer Discretionary': '#FFD43B',
  'Consumer Staples': '#A9E34B',
  'Health Care': '#51CF66',
  Financials: '#40C057',
  'Information Technology': '#339AF0',
  'Communication Services': '#748FFC',
  Utilities: '#9775FA',
  'Real Estate': '#DA77F2',
};

export function getSectorColor(sector) {
  return SECTOR_COLORS[sector] || '#808080';
}

export function parseSectorValue(value) {
  if (!value) return 0;

  if (typeof value === 'number') return value;

  const str = String(value).toUpperCase().trim();

  // Remover símbolos de moeda
  const cleanStr = str.replace(/[$€¥₹]/g, '').trim();

  // Processar trilhões
  if (cleanStr.includes('T')) {
    return parseFloat(cleanStr.replace('T', '')) * 1000000000000;
  }

  // Processar bilhões
  if (cleanStr.includes('B')) {
    return parseFloat(cleanStr.replace('B', '')) * 1000000000;
  }

  // Processar milhões
  if (cleanStr.includes('M')) {
    return parseFloat(cleanStr.replace('M', '')) * 1000000;
  }

  return parseFloat(cleanStr) || 0;
}

export function parsePercentage(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;

  const str = String(value).trim();
  return parseFloat(str.replace('%', '')) || 0;
}

const MIN_PLOT_WIDTH = 200;
const NARROW_BREAKPOINT = 700;

/**
 * Calcula a geometria do gráfico a partir da largura realmente disponível.
 *
 * O gráfico era desenhado com um mínimo fixo de 800 px, o que provocava
 * overflow horizontal (e conteúdo cortado) em ecrãs pequenos. Passa a
 * ajustar-se ao contentor e a reduzir o raio máximo das bolhas em mobile,
 * mantendo as proporções e sem alterar nenhum cálculo de dados.
 */
export function computeChartLayout(containerWidth) {
  const available = Math.max(Math.floor(Number(containerWidth) || 0), MIN_PLOT_WIDTH);
  const narrow = available < NARROW_BREAKPOINT;
  const margin = narrow
    ? { top: 30, right: 16, bottom: 78, left: 46 }
    : { top: 40, right: 40, bottom: 60, left: 60 };
  const width = Math.max(available - margin.left - margin.right, MIN_PLOT_WIDTH);
  const height = narrow ? 420 : 500;
  const maxRadius = Math.min(55, Math.max(14, Math.round(width / 11)));

  return {
    narrow,
    margin,
    width,
    height,
    maxRadius,
    totalWidth: width + margin.left + margin.right,
    totalHeight: height + margin.top + margin.bottom,
  };
}

let lastRender = null;

export function renderBubbleChart(companies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  // Limpar container
  container.innerHTML = '';
  lastRender = { companies, containerId };

  // Filtrar dados válidos
  const validData = companies
    .filter((c) => {
      const marketCap = parseSectorValue(c.marketCap);
      return marketCap > 0 && c.sectorName;
    })
    .map((c, idx) => ({
      symbol: c.symbol,
      name: c.name,
      sector: c.sectorName,
      marketCap: parseSectorValue(c.marketCap),
      dividendYield: parsePercentage(c.dividendYield),
      index: idx,
    }));

  if (validData.length === 0) {
    container.innerHTML = '<p>Sem dados disponíveis para o gráfico de bolhas.</p>';
    return;
  }

  // Moldura com scroll horizontal próprio: em ecrãs muito estreitos o SVG
  // nunca empurra a página; o scroll fica confinado a esta área.
  const frame = document.createElement('div');
  frame.className = 'bubble-chart-frame';
  container.appendChild(frame);

  // Dimensões medidas a partir do espaço real (e não de window.innerWidth).
  const layout = computeChartLayout(
    frame.clientWidth || container.clientWidth || window.innerWidth
  );
  const { margin, width, height, maxRadius, narrow } = layout;

  // Escalas
  const minYield = Math.min(...validData.map((d) => d.dividendYield));
  const maxYield = Math.max(...validData.map((d) => d.dividendYield));
  const minMarketCap = Math.min(...validData.map((d) => d.marketCap));
  const maxMarketCap = Math.max(...validData.map((d) => d.marketCap));

  const yScale = (value) => {
    return height - ((value - minYield) / (maxYield - minYield || 1)) * height;
  };

  const sizeScale = (value) => {
    const normalized = (value - minMarketCap) / (maxMarketCap - minMarketCap || 1);
    return 5 + normalized * (maxRadius - 5); // Raio: 5 até maxRadius
  };

  // Distribuir X aleatoriamente (com seed para repetibilidade)
  const seededRandom = (() => {
    let seed = 42;
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  })();

  const xPositions = validData.map(() => seededRandom() * width);

  // Criar SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', layout.totalWidth);
  svg.setAttribute('height', layout.totalHeight);
  svg.setAttribute('viewBox', `0 0 ${layout.totalWidth} ${layout.totalHeight}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    'Gráfico de bolhas: dividend yield no eixo vertical, tamanho pela capitalização bolsista e cor por setor.'
  );
  svg.style.cssText =
    'display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px; max-width: 100%;';

  // Grupo principal
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${margin.left},${margin.top})`);

  // Grid Y (Dividend Yield)
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * height;
    const yieldValue = minYield + (i / 10) * (maxYield - minYield);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', y);
    line.setAttribute('x2', width);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--chart-axis)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4');
    g.appendChild(line);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', -10);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', narrow ? '10' : '12');
    text.setAttribute('fill', 'var(--chart-label)');
    text.textContent = yieldValue.toFixed(1) + '%';
    g.appendChild(text);
  }

  // Eixo Y (Dividend Yield)
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', 0);
  yAxis.setAttribute('y1', 0);
  yAxis.setAttribute('x2', 0);
  yAxis.setAttribute('y2', height);
  yAxis.setAttribute('stroke', 'var(--chart-label)');
  yAxis.setAttribute('stroke-width', '2');
  g.appendChild(yAxis);

  // Label Y
  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.setAttribute('transform', `rotate(-90)`);
  yLabel.setAttribute('y', -margin.left + 20);
  yLabel.setAttribute('x', -height / 2);
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('font-size', narrow ? '12' : '14');
  yLabel.setAttribute('font-weight', 'bold');
  yLabel.setAttribute('fill', 'var(--chart-text)');
  yLabel.textContent = '💵 Dividend Yield (%)';
  g.appendChild(yLabel);

  // Eixo X (posições aleatórias)
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', 0);
  xAxis.setAttribute('y1', height);
  xAxis.setAttribute('x2', width);
  xAxis.setAttribute('y2', height);
  xAxis.setAttribute('stroke', 'var(--chart-label)');
  xAxis.setAttribute('stroke-width', '2');
  g.appendChild(xAxis);

  // Label X (em mobile parte-se em duas linhas para não ser cortado)
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.setAttribute('x', width / 2);
  xLabel.setAttribute('y', height + (narrow ? 26 : 45));
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('font-size', narrow ? '11' : '14');
  xLabel.setAttribute('font-weight', 'bold');
  xLabel.setAttribute('fill', 'var(--chart-text)');

  if (narrow) {
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    line1.setAttribute('x', width / 2);
    line1.setAttribute('dy', '0');
    line1.textContent = '📊 Distribuição Aleatória';

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    line2.setAttribute('x', width / 2);
    line2.setAttribute('dy', '16');
    line2.textContent = '(cada bolha = empresa)';

    xLabel.appendChild(line1);
    xLabel.appendChild(line2);
  } else {
    xLabel.textContent = '📊 Distribuição Aleatória (cada bolha = empresa)';
  }

  g.appendChild(xLabel);

  // Renderizar bolhas
  validData.forEach((d, idx) => {
    const radius = sizeScale(d.marketCap);
    // Manter a bolha inteiramente dentro da área de plotagem (sem cortes).
    const x = Math.min(Math.max(xPositions[idx], radius), Math.max(width - radius, radius));
    const y = Math.min(
      Math.max(yScale(d.dividendYield), radius),
      Math.max(height - radius, radius)
    );
    const color = getSectorColor(d.sector);

    // Círculo
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', color);
    circle.setAttribute('opacity', '0.7');
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    circle.style.cursor = 'pointer';
    circle.style.transition = 'all 0.3s ease';

    // Hover
    circle.addEventListener('mouseover', (e) => {
      circle.setAttribute('opacity', '1');
      circle.setAttribute('stroke-width', '3');
      showTooltip(e, d, radius);
    });

    circle.addEventListener('mouseout', () => {
      circle.setAttribute('opacity', '0.7');
      circle.setAttribute('stroke-width', '2');
      hideTooltip();
    });

    g.appendChild(circle);

    // Símbolo (texto pequeno)
    if (radius > 15) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', Math.max(10, radius / 2));
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#fff');
      text.setAttribute('pointer-events', 'none');
      text.textContent = d.symbol.substring(0, 3);
      g.appendChild(text);
    }
  });

  svg.appendChild(g);
  frame.appendChild(svg);

  // Legenda
  addLegend(container, validData);
}

function addLegend(container, data) {
  const legendContainer = document.createElement('div');
  legendContainer.className = 'bubble-legend';
  legendContainer.style.cssText = `
    margin: 30px auto;
    width: 100%;
    max-width: 800px;
    padding: 16px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;

  // Título
  const title = document.createElement('h3');
  title.textContent = '🫧 Como ler o gráfico';
  title.style.cssText = 'margin: 0 0 12px 0; color: var(--text-primary);';
  legendContainer.appendChild(title);

  // Explicação
  const info = document.createElement('div');
  info.style.cssText =
    'margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;';
  info.innerHTML = `
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `;
  legendContainer.appendChild(info);

  // Cores por setor
  const sectorTitle = document.createElement('div');
  sectorTitle.textContent = 'Setores';
  sectorTitle.style.cssText =
    'font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;';
  legendContainer.appendChild(sectorTitle);

  const sectorsSet = new Set(data.map((d) => d.sector));
  const colorLegend = document.createElement('div');
  colorLegend.style.cssText = 'display: flex; flex-wrap: wrap; gap: 12px;';

  sectorsSet.forEach((sector) => {
    const item = document.createElement('div');
    item.style.cssText =
      'display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);';

    const swatch = document.createElement('span');
    swatch.style.cssText = `display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${getSectorColor(sector)};`;

    const label = document.createElement('span');
    label.textContent = sector;

    item.appendChild(swatch);
    item.appendChild(label);
    colorLegend.appendChild(item);
  });

  legendContainer.appendChild(colorLegend);
  container.appendChild(legendContainer);
}

let currentTooltip = null;

function showTooltip(event, d) {
  hideTooltip();

  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: fixed;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--accent-cyan);
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  `;

  const marketCapStr =
    d.marketCap >= 1e12
      ? (d.marketCap / 1e12).toFixed(2) + 'T'
      : d.marketCap >= 1e9
        ? (d.marketCap / 1e9).toFixed(2) + 'B'
        : (d.marketCap / 1e6).toFixed(2) + 'M';

  tooltip.innerHTML = `
    <strong>${d.symbol}</strong> — ${d.name}<br>
    <strong>Setor:</strong> ${d.sector}<br>
    <strong>Market Cap:</strong> $${marketCapStr}<br>
    <strong>Dividend Yield:</strong> ${d.dividendYield.toFixed(2)}%
  `;

  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = rect.left + 10 + 'px';
  tooltip.style.top = rect.top - 10 + 'px';

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
}

function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}

// ========== REDIMENSIONAMENTO ==========
// Recalcula o gráfico quando a janela muda de tamanho (rotação do telemóvel,
// redimensionamento do desktop). Só atua se o gráfico estiver visível.
let resizeTimer = null;

function rerenderOnResize() {
  if (!lastRender) return;

  const container = document.getElementById(lastRender.containerId);
  if (!container || container.offsetParent === null) return;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!lastRender) return;
    renderBubbleChart(lastRender.companies, lastRender.containerId);
  }, 150);
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', rerenderOnResize);
}
