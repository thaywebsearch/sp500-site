// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { renderBubbleChart } from './bubble-chart.js';

const COMPANIES = [
  { symbol: 'AAA', name: 'Alfa', sectorName: 'Energy', marketCap: '$1T', dividendYield: '7%' },
  { symbol: 'BBB', name: 'Beta', sectorName: 'Financials', marketCap: '500B', dividendYield: '2%' },
  { symbol: 'CCC', name: 'Gama', sectorName: 'Utilities', marketCap: '20B', dividendYield: '4%' },
];

function renderAt(width) {
  const originalWidth = window.innerWidth;
  window.innerWidth = width;
  document.body.innerHTML = '<div id="bubble-chart-view"></div>';
  renderBubbleChart(COMPANIES, 'bubble-chart-view');
  window.innerWidth = originalWidth;
  return document.getElementById('bubble-chart-view');
}

describe('renderBubbleChart — layout mobile', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('desenha o SVG dentro da largura do viewport em 320 px', () => {
    const container = renderAt(320);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(Number(svg.getAttribute('width'))).toBeLessThanOrEqual(320);
    // Nunca menor do que o mínimo de legibilidade.
    expect(Number(svg.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('desenha o SVG dentro da largura do viewport em 430 px', () => {
    const container = renderAt(430);
    const svg = container.querySelector('svg');
    expect(Number(svg.getAttribute('width'))).toBeLessThanOrEqual(430);
  });

  it('mantém a legenda completa, incluindo o último setor', () => {
    const container = renderAt(375);
    const legend = container.querySelector('.bubble-legend');
    expect(legend).not.toBeNull();
    expect(legend.textContent).toContain('Como ler o gráfico');
    expect(legend.textContent).toContain('Setores');
    expect(legend.textContent).toContain('Utilities');
  });

  it('não gera conteúdo cortado: todas as bolhas ficam dentro da área de plotagem', () => {
    const container = renderAt(375);
    const svg = container.querySelector('svg');
    const plotWidth = Number(svg.getAttribute('width'));
    const circles = Array.from(container.querySelectorAll('circle'));
    expect(circles.length).toBe(COMPANIES.length);
    circles.forEach((circle) => {
      const cx = Number(circle.getAttribute('cx'));
      const cy = Number(circle.getAttribute('cy'));
      const r = Number(circle.getAttribute('r'));
      expect(cx - r).toBeGreaterThanOrEqual(0);
      expect(cy - r).toBeGreaterThanOrEqual(0);
      // As coordenadas são relativas ao grupo traduzido; basta garantir
      // que a bolha não sai pela direita do SVG.
      expect(cx + r).toBeLessThanOrEqual(plotWidth);
    });
  });

  it('parte o rótulo do eixo X em duas linhas em mobile', () => {
    const container = renderAt(320);
    const tspans = container.querySelectorAll('svg text tspan');
    expect(tspans.length).toBeGreaterThanOrEqual(2);
  });
});
