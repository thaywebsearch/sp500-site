import { describe, expect, it } from 'vitest';
import {
  DIVIDEND_ARISTOCRATS,
  aristocratBreakdown,
  aristocratSectorOptions,
  filterDividendAristocrats,
  getAristocratSectorClass,
  maxYears,
  sectorColor,
  sectorSlug,
  sortDividendAristocrats,
} from './dividend-aristocrats.js';

const item = (company, ticker, sector, years) => ({ company, ticker, sector, years });

describe('DIVIDEND_ARISTOCRATS', () => {
  it('tem 71 empresas com company, ticker, sector e years', () => {
    expect(DIVIDEND_ARISTOCRATS).toHaveLength(71);
    DIVIDEND_ARISTOCRATS.forEach((c) => {
      expect(typeof c.company).toBe('string');
      expect(c.company.length).toBeGreaterThan(0);
      expect(c.ticker).toMatch(/^[A-Z.]+$/);
      expect(typeof c.sector).toBe('string');
      expect(c.years).toBeGreaterThanOrEqual(25);
    });
  });

  it('não tem tickers duplicados', () => {
    const tickers = DIVIDEND_ARISTOCRATS.map((c) => c.ticker);
    expect(new Set(tickers).size).toBe(tickers.length);
  });
});

describe('sectorSlug e getAristocratSectorClass', () => {
  it('converte o nome do setor em slug', () => {
    expect(sectorSlug('Health Care')).toBe('health-care');
    expect(sectorSlug('Information Technology')).toBe('information-technology');
    expect(sectorSlug('')).toBe('');
  });

  it('devolve a classe CSS do setor', () => {
    expect(getAristocratSectorClass('Consumer Staples')).toBe('da-sector--consumer-staples');
  });

  it('devolve uma cor para cada setor e uma cor por omissão', () => {
    expect(sectorColor('Materials')).toMatch(/^#/);
    expect(sectorColor('Inexistente')).toBe('#ffc107');
  });
});

describe('maxYears', () => {
  it('devolve a maior sequência de anos', () => {
    expect(maxYears([item('A', 'A', 'X', 25), item('B', 'B', 'Y', 70)])).toBe(70);
  });

  it('devolve 0 para lista vazia ou inválida', () => {
    expect(maxYears([])).toBe(0);
    expect(maxYears(null)).toBe(0);
  });
});

describe('filterDividendAristocrats', () => {
  const list = [
    item('Colgate-Palmolive', 'CL', 'Consumer Staples', 62),
    item('Coca-Cola', 'KO', 'Consumer Staples', 62),
    item('Fastenal', 'FAST', 'Industrials', 25),
    item('Johnson & Johnson', 'JNJ', 'Health Care', 62),
  ];

  it('filtra por empresa (case-insensitive)', () => {
    expect(filterDividendAristocrats(list, { search: 'coca' }).map((c) => c.ticker)).toEqual([
      'KO',
    ]);
  });

  it('filtra por ticker', () => {
    expect(filterDividendAristocrats(list, { search: 'jnj' }).map((c) => c.ticker)).toEqual([
      'JNJ',
    ]);
  });

  it('filtra por setor', () => {
    expect(
      filterDividendAristocrats(list, { sector: 'Consumer Staples' }).map((c) => c.ticker)
    ).toEqual(['CL', 'KO']);
  });

  it('filtra por mínimo de anos', () => {
    expect(filterDividendAristocrats(list, { minYears: 40 }).map((c) => c.ticker)).toEqual([
      'CL',
      'KO',
      'JNJ',
    ]);
    expect(filterDividendAristocrats(list, { minYears: 70 })).toEqual([]);
  });

  it('combina busca, setor e anos e tolera lista inválida', () => {
    expect(
      filterDividendAristocrats(list, { search: 'o', sector: 'Consumer Staples', minYears: 60 })
    ).toHaveLength(2);
    expect(filterDividendAristocrats(list, { search: 'zzz' })).toEqual([]);
    expect(filterDividendAristocrats(null)).toEqual([]);
  });
});

describe('sortDividendAristocrats', () => {
  const list = [
    item('Coca-Cola', 'KO', 'Consumer Staples', 62),
    item('Aflac', 'AFL', 'Financials', 44),
    item('Dover', 'DOV', 'Industrials', 70),
  ];

  it('ordena por anos (maior primeiro) por omissão', () => {
    expect(sortDividendAristocrats(list).map((c) => c.ticker)).toEqual(['DOV', 'KO', 'AFL']);
  });

  it('ordena por empresa, ticker e setor', () => {
    expect(sortDividendAristocrats(list, 'company').map((c) => c.ticker)).toEqual([
      'AFL',
      'KO',
      'DOV',
    ]);
    expect(sortDividendAristocrats(list, 'ticker').map((c) => c.ticker)).toEqual([
      'AFL',
      'DOV',
      'KO',
    ]);
    expect(sortDividendAristocrats(list, 'sector').map((c) => c.sector)).toEqual([
      'Consumer Staples',
      'Financials',
      'Industrials',
    ]);
  });

  it('não altera a lista original', () => {
    const copy = [...list];
    sortDividendAristocrats(list, 'ticker');
    expect(list).toEqual(copy);
  });
});

describe('aristocratSectorOptions', () => {
  it('devolve setores únicos e ordenados', () => {
    const list = [
      item('B', 'B', 'Utilities', 30),
      item('A', 'A', 'Materials', 40),
      item('C', 'C', 'Utilities', 50),
    ];
    expect(aristocratSectorOptions(list)).toEqual(['Materials', 'Utilities']);
  });
});

describe('aristocratBreakdown', () => {
  it('agrupa por setor, ordenado por contagem', () => {
    const list = [
      item('A', 'A', 'Utilities', 30),
      item('B', 'B', 'Utilities', 40),
      item('C', 'C', 'Energy', 50),
    ];
    const result = aristocratBreakdown(list);
    expect(result[0]).toEqual({ sector: 'Utilities', companies: ['A', 'B'], count: 2 });
    expect(result[1]).toEqual({ sector: 'Energy', companies: ['C'], count: 1 });
  });

  it('trata lista inválida', () => {
    expect(aristocratBreakdown(null)).toEqual([]);
  });
});
