import { describe, expect, it } from 'vitest';
import {
  averageYield,
  buildDividendSummary,
  getDividendPayers,
  getYield,
  medianYield,
  sectorDividendStats,
  topByYield,
  yieldBuckets,
} from './dividends.js';

const company = (symbol, dividendYield, opts = {}) => ({
  symbol,
  name: opts.name || `${symbol} Inc`,
  sectorName: opts.sectorName || 'Tech',
  dividendYield,
});

describe('getYield', () => {
  it('devolve o valor numérico quando positivo', () => {
    expect(getYield({ dividendYield: 3.5 })).toBe(3.5);
    expect(getYield({ dividendYield: '2.1' })).toBe(2.1);
  });

  it('devolve 0 para valores inválidos ou não positivos', () => {
    expect(getYield({ dividendYield: 0 })).toBe(0);
    expect(getYield({ dividendYield: -1 })).toBe(0);
    expect(getYield({ dividendYield: 'abc' })).toBe(0);
    expect(getYield({})).toBe(0);
    expect(getYield(null)).toBe(0);
  });
});

describe('getDividendPayers', () => {
  it('filtra apenas empresas com yield positivo', () => {
    const result = getDividendPayers([company('A', 2), company('B', 0), company('C', 4)]);
    expect(result.map((c) => c.symbol)).toEqual(['A', 'C']);
  });

  it('trata listas inválidas', () => {
    expect(getDividendPayers(null)).toEqual([]);
  });
});

describe('averageYield e medianYield', () => {
  it('calcula a média apenas sobre pagadoras', () => {
    expect(averageYield([company('A', 2), company('B', 4), company('C', 0)])).toBe(3);
    expect(averageYield([company('A', 0)])).toBe(0);
  });

  it('calcula a mediana (ímpar e par)', () => {
    expect(medianYield([company('A', 1), company('B', 3), company('C', 2)])).toBe(2);
    expect(medianYield([company('A', 1), company('B', 2), company('C', 3), company('D', 4)])).toBe(
      2.5
    );
    expect(medianYield([])).toBe(0);
  });
});

describe('buildDividendSummary', () => {
  it('resume total, pagadoras, rácio, média, mediana e máximo', () => {
    const summary = buildDividendSummary([
      company('A', 2),
      company('B', 4),
      company('C', 0),
      company('D', 6),
    ]);
    expect(summary.total).toBe(4);
    expect(summary.payers).toBe(3);
    expect(summary.nonPayers).toBe(1);
    expect(summary.payerRatio).toBeCloseTo(0.75);
    expect(summary.avgYield).toBe(4);
    expect(summary.medianYield).toBe(4);
    expect(summary.maxYield).toBe(6);
  });

  it('devolve zeros sem empresas', () => {
    const summary = buildDividendSummary([]);
    expect(summary).toEqual({
      total: 0,
      payers: 0,
      nonPayers: 0,
      payerRatio: 0,
      avgYield: 0,
      medianYield: 0,
      maxYield: 0,
    });
  });
});

describe('topByYield', () => {
  it('ordena por yield decrescente e limita', () => {
    const result = topByYield(
      [company('A', 1), company('B', 5), company('C', 3), company('D', 0)],
      2
    );
    expect(result.map((c) => c.symbol)).toEqual(['B', 'C']);
  });

  it('desempata pelo símbolo', () => {
    const result = topByYield([company('Z', 3), company('A', 3)]);
    expect(result.map((c) => c.symbol)).toEqual(['A', 'Z']);
  });
});

describe('yieldBuckets', () => {
  it('distribui as pagadoras pelas faixas', () => {
    const buckets = yieldBuckets([
      company('A', 0.5),
      company('B', 1.5),
      company('C', 2.5),
      company('E', 5.5),
      company('F', 0),
    ]);
    expect(yieldBuckets([company('X', 1)])).toHaveLength(6);
    const counts = buckets.map((b) => b.count);
    expect(counts).toEqual([1, 1, 1, 0, 0, 1]);
  });
});

describe('sectorDividendStats', () => {
  it('agrega pagadoras e yield médio por setor, ordenado por média', () => {
    const result = sectorDividendStats([
      company('A', 2, { sectorName: 'Energy' }),
      company('B', 4, { sectorName: 'Energy' }),
      company('C', 1, { sectorName: 'Tech' }),
      company('D', 0, { sectorName: 'Tech' }),
    ]);
    expect(result[0]).toEqual({ sector: 'Energy', total: 2, payers: 2, avgYield: 3 });
    expect(result[1]).toEqual({ sector: 'Tech', total: 2, payers: 1, avgYield: 1 });
  });

  it('ordena por yield médio e trata setor sem pagadoras', () => {
    const stats = sectorDividendStats([
      company('A', 4, { sectorName: 'Energy' }),
      company('B', 1, { sectorName: 'Tech' }),
      company('C', 0, { sectorName: 'Utilities' }),
    ]);
    expect(stats[0].sector).toBe('Energy');
    expect(stats[2].sector).toBe('Utilities');
    expect(stats[2].avgYield).toBe(0);
  });
});
