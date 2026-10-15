import { describe, expect, it } from 'vitest';
import {
  NASDAQ_100,
  filterNasdaq100,
  formatCap,
  getNasdaqSectorClass,
  nasdaqBreakdown,
  nasdaqSectorOptions,
  sectorColor,
  sectorSlug,
  sortNasdaq100,
  totalMarketCap,
  totalWeight,
} from './nasdaq-100.js';

const item = (overrides) => ({
  rank: 1,
  ticker: 'AAA',
  company: 'Alpha',
  sector: 'Technology',
  weight: 1,
  cap: 100,
  category: 'Large Cap',
  cumulative: 1,
  concentration: 'Top 10',
  ...overrides,
});

describe('NASDAQ_100', () => {
  it('tem 100 empresas com campos completos', () => {
    expect(NASDAQ_100).toHaveLength(100);
    NASDAQ_100.forEach((c) => {
      expect(c.ticker).toMatch(/^[A-Z.]+$/);
      expect(c.company).toBeTruthy();
      expect(c.sector).toBeTruthy();
      expect(typeof c.weight).toBe('number');
      expect(typeof c.cap).toBe('number');
      expect(['Mega Cap', 'Large Cap']).toContain(c.category);
      expect(typeof c.cumulative).toBe('number');
      expect(c.concentration).toBeTruthy();
    });
  });

  it('tem rankings 1..100 únicos e tickers únicos', () => {
    const ranks = NASDAQ_100.map((c) => c.rank).sort((a, b) => a - b);
    expect(ranks[0]).toBe(1);
    expect(ranks[99]).toBe(100);
    expect(new Set(ranks).size).toBe(100);

    const tickers = NASDAQ_100.map((c) => c.ticker);
    expect(new Set(tickers).size).toBe(tickers.length);
  });

  it('soma cerca de 100% de peso', () => {
    expect(totalWeight(NASDAQ_100)).toBeCloseTo(99.94, 2);
  });
});

describe('sectorSlug, getNasdaqSectorClass e sectorColor', () => {
  it('converte o nome do setor em slug', () => {
    expect(sectorSlug('Communication Services')).toBe('communication-services');
    expect(sectorSlug('Health Care')).toBe('health-care');
    expect(sectorSlug('')).toBe('');
  });

  it('devolve a classe CSS do setor', () => {
    expect(getNasdaqSectorClass('Technology')).toBe('nq-sector--technology');
  });

  it('devolve cor do setor e cor por omissão', () => {
    expect(sectorColor('Energy')).toMatch(/^#/);
    expect(sectorColor('Inexistente')).toBe('#00d4ff');
  });
});

describe('formatCap', () => {
  it('formata bilhões e trilhões', () => {
    expect(formatCap(181.7)).toBe('$181.7B');
    expect(formatCap(1000)).toBe('$1.00T');
    expect(formatCap(5470)).toBe('$5.47T');
    expect(formatCap(0)).toBe('$0.0B');
  });
});

describe('totalMarketCap e totalWeight', () => {
  it('soma market cap e peso', () => {
    const list = [item({ cap: 1000, weight: 13.31 }), item({ cap: 500, weight: 11.57 })];
    expect(totalMarketCap(list)).toBe(1500);
    expect(totalWeight(list)).toBeCloseTo(24.88, 2);
  });

  it('trata lista inválida', () => {
    expect(totalMarketCap(null)).toBe(0);
    expect(totalWeight(null)).toBe(0);
  });
});

describe('filterNasdaq100', () => {
  const list = [
    item({
      rank: 1,
      ticker: 'AAPL',
      company: 'Apple Inc.',
      sector: 'Technology',
      category: 'Mega Cap',
    }),
    item({
      rank: 4,
      ticker: 'AMZN',
      company: 'Amazon.com Inc.',
      sector: 'Consumer Discretionary',
      category: 'Mega Cap',
    }),
    item({
      rank: 68,
      ticker: 'FANG',
      company: 'Diamondback Energy Inc.',
      sector: 'Energy',
      category: 'Large Cap',
    }),
  ];

  it('filtra por empresa e ticker (case-insensitive)', () => {
    expect(filterNasdaq100(list, { search: 'apple' }).map((c) => c.ticker)).toEqual(['AAPL']);
    expect(filterNasdaq100(list, { search: 'fng' }).map((c) => c.ticker)).toEqual([]);
    expect(filterNasdaq100(list, { search: 'fang' }).map((c) => c.ticker)).toEqual(['FANG']);
  });

  it('filtra por setor e categoria', () => {
    expect(filterNasdaq100(list, { sector: 'Energy' }).map((c) => c.ticker)).toEqual(['FANG']);
    expect(filterNasdaq100(list, { category: 'Mega Cap' }).map((c) => c.ticker)).toEqual([
      'AAPL',
      'AMZN',
    ]);
  });

  it('combina filtros e tolera lista inválida', () => {
    expect(
      filterNasdaq100(list, { sector: 'Technology', category: 'Mega Cap' }).map((c) => c.ticker)
    ).toEqual(['AAPL']);
    expect(filterNasdaq100(list, { search: 'zzz' })).toEqual([]);
    expect(filterNasdaq100(null)).toEqual([]);
  });
});

describe('sortNasdaq100', () => {
  const list = [
    item({
      rank: 4,
      ticker: 'AMZN',
      company: 'Amazon',
      sector: 'Consumer Discretionary',
      cap: 2910,
      weight: 7.07,
    }),
    item({
      rank: 1,
      ticker: 'NVDA',
      company: 'NVIDIA',
      sector: 'Technology',
      cap: 5470,
      weight: 13.31,
    }),
    item({
      rank: 68,
      ticker: 'FANG',
      company: 'Diamondback',
      sector: 'Energy',
      cap: 56.6,
      weight: 0.17,
    }),
  ];

  it('ordena por ranking por omissão', () => {
    expect(sortNasdaq100(list).map((c) => c.ticker)).toEqual(['NVDA', 'AMZN', 'FANG']);
  });

  it('ordena por market cap e peso (descendente)', () => {
    expect(sortNasdaq100(list, 'cap').map((c) => c.ticker)).toEqual(['NVDA', 'AMZN', 'FANG']);
    expect(sortNasdaq100(list, 'weight').map((c) => c.ticker)).toEqual(['NVDA', 'AMZN', 'FANG']);
  });

  it('ordena por empresa, ticker e setor', () => {
    expect(sortNasdaq100(list, 'company').map((c) => c.ticker)).toEqual(['AMZN', 'FANG', 'NVDA']);
    expect(sortNasdaq100(list, 'ticker').map((c) => c.ticker)).toEqual(['AMZN', 'FANG', 'NVDA']);
    expect(sortNasdaq100(list, 'sector').map((c) => c.sector)).toEqual([
      'Consumer Discretionary',
      'Energy',
      'Technology',
    ]);
  });

  it('não altera a lista original', () => {
    const copy = [...list];
    sortNasdaq100(list, 'cap');
    expect(list).toEqual(copy);
  });
});

describe('nasdaqSectorOptions', () => {
  it('devolve setores únicos e ordenados', () => {
    const list = [
      item({ sector: 'Technology' }),
      item({ sector: 'Energy' }),
      item({ sector: 'Technology' }),
    ];
    expect(nasdaqSectorOptions(list)).toEqual(['Energy', 'Technology']);
  });
});

describe('nasdaqBreakdown', () => {
  it('agrupa por setor com contagem e peso, ordenado por contagem', () => {
    const list = [
      item({ ticker: 'A', sector: 'Technology', weight: 10 }),
      item({ ticker: 'B', sector: 'Technology', weight: 5 }),
      item({ ticker: 'C', sector: 'Energy', weight: 3 }),
    ];
    const result = nasdaqBreakdown(list);
    expect(result[0]).toEqual({
      sector: 'Technology',
      companies: ['A', 'B'],
      count: 2,
      weight: 15,
    });
    expect(result[1]).toEqual({ sector: 'Energy', companies: ['C'], count: 1, weight: 3 });
  });

  it('trata lista inválida', () => {
    expect(nasdaqBreakdown(null)).toEqual([]);
  });
});
