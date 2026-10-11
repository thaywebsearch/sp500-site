import { describe, expect, it } from 'vitest';
import {
  DOW_JONES,
  dowSectorOptions,
  filterDowJones,
  getDowSectorClass,
  sectorBreakdown,
  sectorSlug,
  sortDowJones,
  techCount,
} from './dow-jones.js';

const item = (company, ticker, sector) => ({ company, ticker, sector });

describe('DOW_JONES', () => {
  it('tem 30 empresas com campos completos', () => {
    expect(DOW_JONES).toHaveLength(30);
    DOW_JONES.forEach((c) => {
      expect(c.company).toBeTruthy();
      expect(c.ticker).toBeTruthy();
      expect(c.sector).toBeTruthy();
    });
  });
});

describe('sectorSlug e getDowSectorClass', () => {
  it('converte o nome do setor em slug', () => {
    expect(sectorSlug('Information Technology')).toBe('information-technology');
    expect(sectorSlug('Health Care')).toBe('health-care');
    expect(sectorSlug('')).toBe('');
  });

  it('devolve a classe CSS do setor', () => {
    expect(getDowSectorClass('Consumer Staples')).toBe('dow-sector--consumer-staples');
  });
});

describe('filterDowJones', () => {
  const list = [
    item('Apple', 'AAPL', 'Information Technology'),
    item('Boeing', 'BA', 'Industrials'),
    item('Visa', 'V', 'Financials'),
  ];

  it('filtra por empresa (case-insensitive)', () => {
    expect(filterDowJones(list, { search: 'app' }).map((c) => c.ticker)).toEqual(['AAPL']);
  });

  it('filtra por ticker', () => {
    expect(filterDowJones(list, { search: 'ba' }).map((c) => c.ticker)).toEqual(['BA']);
  });

  it('filtra por setor', () => {
    expect(filterDowJones(list, { sector: 'Financials' }).map((c) => c.ticker)).toEqual(['V']);
  });

  it('combina busca e setor e tolera lista inválida', () => {
    expect(filterDowJones(list, { search: 'a', sector: 'Industrials' })).toHaveLength(1);
    expect(filterDowJones(list, { search: 'zzz' })).toEqual([]);
    expect(filterDowJones(null)).toEqual([]);
  });
});

describe('sortDowJones', () => {
  const list = [
    item('Visa', 'V', 'Financials'),
    item('Apple', 'AAPL', 'Information Technology'),
    item('Boeing', 'BA', 'Industrials'),
  ];

  it('ordena por empresa por omissão', () => {
    expect(sortDowJones(list).map((c) => c.company)).toEqual(['Apple', 'Boeing', 'Visa']);
  });

  it('ordena por ticker e por setor', () => {
    expect(sortDowJones(list, 'ticker').map((c) => c.ticker)).toEqual(['AAPL', 'BA', 'V']);
    expect(sortDowJones(list, 'sector').map((c) => c.sector)).toEqual([
      'Financials',
      'Industrials',
      'Information Technology',
    ]);
  });

  it('não altera a lista original', () => {
    const original = [...list];
    sortDowJones(list, 'ticker');
    expect(list).toEqual(original);
  });
});

describe('dowSectorOptions', () => {
  it('devolve setores únicos e ordenados', () => {
    const list = [
      item('B', 'B', 'Industrials'),
      item('A', 'A', 'Energy'),
      item('C', 'C', 'Industrials'),
    ];
    expect(dowSectorOptions(list)).toEqual(['Energy', 'Industrials']);
  });
});

describe('sectorBreakdown', () => {
  it('agrupa por setor, ordenado por contagem', () => {
    const list = [
      item('A', 'A', 'Industrials'),
      item('B', 'B', 'Industrials'),
      item('C', 'C', 'Energy'),
    ];
    const result = sectorBreakdown(list);
    expect(result[0]).toEqual({ sector: 'Industrials', companies: ['A', 'B'], count: 2 });
    expect(result[1]).toEqual({ sector: 'Energy', companies: ['C'], count: 1 });
  });

  it('trata lista inválida', () => {
    expect(sectorBreakdown(null)).toEqual([]);
  });
});

describe('techCount', () => {
  it('conta apenas Information Technology', () => {
    const list = [
      item('A', 'A', 'Information Technology'),
      item('B', 'B', 'Industrials'),
      item('C', 'C', 'Information Technology'),
    ];
    expect(techCount(list)).toBe(2);
  });
});
