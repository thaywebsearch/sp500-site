import { describe, expect, it } from 'vitest';
import {
  computeChartLayout,
  getSectorColor,
  parseSectorValue,
  parsePercentage,
} from './bubble-chart.js';

describe('parseSectorValue', () => {
  it('devolve 0 para valores falsy', () => {
    expect(parseSectorValue(null)).toBe(0);
    expect(parseSectorValue(undefined)).toBe(0);
    expect(parseSectorValue(0)).toBe(0);
    expect(parseSectorValue('')).toBe(0);
  });

  it('mantém números tal como estão', () => {
    expect(parseSectorValue(1_500_000_000)).toBe(1_500_000_000);
  });

  it('interpreta sufixos T, B e M', () => {
    expect(parseSectorValue('$2T')).toBe(2_000_000_000_000);
    expect(parseSectorValue('1.5b')).toBe(1_500_000_000);
    expect(parseSectorValue('500M')).toBe(500_000_000);
  });

  it('interpreta valores sem sufixo e trata inválidos', () => {
    expect(parseSectorValue('1234')).toBe(1234);
    expect(parseSectorValue('xyz')).toBe(0);
  });
});

describe('parsePercentage', () => {
  it('remove o sinal de percentagem', () => {
    expect(parsePercentage('2.5%')).toBe(2.5);
    expect(parsePercentage('0%')).toBe(0);
  });

  it('mantém números e trata valores ausentes/inválidos', () => {
    expect(parsePercentage(3)).toBe(3);
    expect(parsePercentage(null)).toBe(0);
    expect(parsePercentage('')).toBe(0);
    expect(parsePercentage('abc')).toBe(0);
  });
});

describe('getSectorColor', () => {
  it('devolve a cor do setor conhecido', () => {
    expect(getSectorColor('Energy')).toBe('#FF6B6B');
    expect(getSectorColor('Information Technology')).toBe('#339AF0');
  });

  it('devolve cinza para setor desconhecido', () => {
    expect(getSectorColor('Inexistente')).toBe('#808080');
    expect(getSectorColor(undefined)).toBe('#808080');
  });
});

describe('computeChartLayout', () => {
  it('cabe na largura disponível em ecrãs pequenos', () => {
    const layout = computeChartLayout(296);
    expect(layout.narrow).toBe(true);
    expect(layout.totalWidth).toBeLessThanOrEqual(296);
    expect(layout.width).toBeGreaterThanOrEqual(200);
  });

  it('cabe na largura disponível em desktop', () => {
    const layout = computeChartLayout(1280);
    expect(layout.narrow).toBe(false);
    expect(layout.totalWidth).toBeLessThanOrEqual(1280);
  });

  it('reduz o raio máximo das bolhas em ecrãs estreitos', () => {
    expect(computeChartLayout(296).maxRadius).toBeLessThan(computeChartLayout(1280).maxRadius);
  });

  it('respeita limites mínimos para larguras anómalas', () => {
    const layout = computeChartLayout(0);
    expect(layout.width).toBeGreaterThanOrEqual(200);
    expect(layout.maxRadius).toBeGreaterThanOrEqual(14);
  });
});
