import { describe, expect, it } from 'vitest';
import { buildChart, fmtDataBr, fmtPreco } from './price-chart.js';

describe('fmtDataBr', () => {
  it('converte ISO para dd/mm/aa', () => {
    expect(fmtDataBr('2024-03-15')).toBe('15/03/24');
  });

  it('devolve vazio para valores ausentes', () => {
    expect(fmtDataBr('')).toBe('');
    expect(fmtDataBr(null)).toBe('');
  });
});

describe('fmtPreco', () => {
  it('usa 0 casas para valores >= 100', () => {
    expect(fmtPreco(150)).toBe('$150');
    expect(fmtPreco(100)).toBe('$100');
  });

  it('usa 2 casas abaixo de 100', () => {
    expect(fmtPreco(99.5)).toBe('$99.50');
    expect(fmtPreco(12.34)).toBe('$12.34');
  });

  it('devolve travessão para valores não finitos', () => {
    expect(fmtPreco(Number.NaN)).toBe('—');
    expect(fmtPreco(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('buildChart', () => {
  const data = [
    { data: '2024-01-01', close: 100 },
    { data: '2024-01-02', close: 105 },
    { data: '2024-01-03', close: 102 },
  ];

  it('gera um SVG com a série de preços', () => {
    const svg = buildChart(data);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('polyline');
    expect(svg).toContain('polygon');
  });

  it('mostra o último preço e as datas do eixo X', () => {
    const svg = buildChart(data);
    expect(svg).toContain('$102');
    expect(svg).toContain('01/01/24');
    expect(svg).toContain('03/01/24');
  });
});
