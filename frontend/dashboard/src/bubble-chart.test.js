import { describe, expect, it } from 'vitest';
import { getSectorColor, parseSectorValue, parsePercentage } from './bubble-chart.js';

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
