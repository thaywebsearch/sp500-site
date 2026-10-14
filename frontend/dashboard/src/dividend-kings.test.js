import { describe, expect, it } from 'vitest';
import {
  DIVIDEND_KINGS,
  filterDividendKings,
  getKingSectorClass,
  kingBreakdown,
  kingSectorOptions,
  sectorColor,
  sectorSlug,
  sortDividendKings,
} from './dividend-kings.js';

const item = (company, ticker, sector) => ({ company, ticker, sector });

describe('DIVIDEND_KINGS', () => {
  it('tem 38 empresas com company, ticker e sector', () => {
    expect(DIVIDEND_KINGS).toHaveLength(38);
    DIVIDEND_KINGS.forEach((c) => {
      expect(typeof c.company).toBe('string');
      expect(c.company.length).toBeGreaterThan(0);
      expect(c.ticker).toMatch(/^[A-Z.]+$/);
      expect(typeof c.sector).toBe('string');
    });
  });

  it('não tem tickers duplicados', () => {
    const tickers = DIVIDEND_KINGS.map((c) => c.ticker);
    expect(new Set(tickers).size).toBe(tickers.length);
  });
});

describe('sectorSlug e getKingSectorClass', () => {
  it('converte o nome do setor em slug', () => {
    expect(sectorSlug('Consumer Defensive')).toBe('consumer-defensive');
    expect(sectorSlug('Basic Materials')).toBe('basic-materials');
    expect(sectorSlug('')).toBe('');
  });

  it('devolve a classe CSS do setor', () => {
    expect(getKingSectorClass('Healthcare')).toBe('dk-sector--healthcare');
  });

  it('devolve uma cor para cada setor e uma cor por omissão', () => {
    expect(sectorColor('Utilities')).toMatch(/^#/);
    expect(sectorColor('Inexistente')).toBe('#00e676');
  });
});

describe('filterDividendKings', () => {
  const list = [
    item('American States Water', 'AWR', 'Utilities'),
    item('Coca-Cola', 'KO', 'Consumer Defensive'),
    item('Johnson & Johnson', 'JNJ', 'Healthcare'),
  ];

  it('filtra por empresa (case-insensitive)', () => {
    expect(filterDividendKings(list, { search: 'coca' }).map((c) => c.ticker)).toEqual(['KO']);
  });

  it('filtra por ticker', () => {
    expect(filterDividendKings(list, { search: 'jnj' }).map((c) => c.ticker)).toEqual(['JNJ']);
  });

  it('filtra por setor', () => {
    expect(filterDividendKings(list, { sector: 'Utilities' }).map((c) => c.ticker)).toEqual([
      'AWR',
    ]);
  });

  it('combina busca e setor e tolera lista inválida', () => {
    expect(filterDividendKings(list, { search: 'o', sector: 'Consumer Defensive' })).toHaveLength(
      1
    );
    expect(filterDividendKings(list, { search: 'zzz' })).toEqual([]);
    expect(filterDividendKings(null)).toEqual([]);
  });
});

describe('sortDividendKings', () => {
  const list = [
    item('Coca-Cola', 'KO', 'Consumer Defensive'),
    item('American States Water', 'AWR', 'Utilities'),
    item('Johnson & Johnson', 'JNJ', 'Healthcare'),
  ];

  it('ordena por empresa (A-Z) por omissão', () => {
    expect(sortDividendKings(list).map((c) => c.ticker)).toEqual(['AWR', 'KO', 'JNJ']);
  });

  it('ordena por ticker', () => {
    expect(sortDividendKings(list, 'ticker').map((c) => c.ticker)).toEqual(['AWR', 'JNJ', 'KO']);
  });

  it('ordena por setor', () => {
    expect(sortDividendKings(list, 'sector').map((c) => c.sector)).toEqual([
      'Consumer Defensive',
      'Healthcare',
      'Utilities',
    ]);
  });

  it('não altera a lista original', () => {
    const copy = [...list];
    sortDividendKings(list, 'ticker');
    expect(list).toEqual(copy);
  });
});

describe('kingSectorOptions', () => {
  it('devolve setores únicos e ordenados', () => {
    const list = [
      item('B', 'B', 'Utilities'),
      item('A', 'A', 'Basic Materials'),
      item('C', 'C', 'Utilities'),
    ];
    expect(kingSectorOptions(list)).toEqual(['Basic Materials', 'Utilities']);
  });
});

describe('kingBreakdown', () => {
  it('agrupa por setor, ordenado por contagem', () => {
    const list = [
      item('A', 'A', 'Utilities'),
      item('B', 'B', 'Utilities'),
      item('C', 'C', 'Energy'),
    ];
    const result = kingBreakdown(list);
    expect(result[0]).toEqual({ sector: 'Utilities', companies: ['A', 'B'], count: 2 });
    expect(result[1]).toEqual({ sector: 'Energy', companies: ['C'], count: 1 });
  });

  it('trata lista inválida', () => {
    expect(kingBreakdown(null)).toEqual([]);
  });
});
