import { describe, expect, it, vi } from 'vitest';
import {
  formatMarketCap,
  escapeHtml,
  debounce,
  getCountry,
  filterCompanies,
  sortCompanies,
} from './utils.js';

describe('formatMarketCap', () => {
  it('retorna N/A para valores falsy', () => {
    expect(formatMarketCap(null)).toBe('N/A');
    expect(formatMarketCap(undefined)).toBe('N/A');
    expect(formatMarketCap(0)).toBe('N/A');
  });

  it('formata trilhões', () => {
    expect(formatMarketCap(2_500_000_000_000)).toBe('$2.50T');
  });

  it('formata bilhões', () => {
    expect(formatMarketCap(84_220_000_000)).toBe('$84.22B');
  });

  it('formata milhões', () => {
    expect(formatMarketCap(3_500_000)).toBe('$3.50M');
  });

  it('formata valores abaixo de 1 milhão', () => {
    expect(formatMarketCap(12345)).toBe('$12,345');
  });
});

describe('escapeHtml', () => {
  it('retorna string vazia para falsy', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('escapa caracteres HTML perigosos', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('A & B')).toBe('A &amp; B');
    expect(escapeHtml('"aspas"')).toBe('&quot;aspas&quot;');
    expect(escapeHtml("'single'")).toBe('&#39;single&#39;');
  });
});

describe('debounce', () => {
  it('agrupa chamadas dentro do intervalo', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

const dataset = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    sector: 'spl',
    marketCap: 3_000_000_000,
    dividendYield: null,
    headquarters: 'Cupertino, California',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    sector: 'tecnologia',
    marketCap: 2_000_000_000,
    dividendYield: 1.5,
    headquarters: 'Redmond, Washington',
  },
  {
    symbol: 'XOM',
    name: 'ExxonMobil',
    sector: 'spl',
    marketCap: 500_000_000,
    dividendYield: 3.2,
    headquarters: 'Irving, Texas',
  },
  {
    symbol: 'SHOP',
    name: 'Shopify',
    sector: 'tecnologia',
    marketCap: 100_000_000,
    dividendYield: null,
    headquarters: 'Ottawa, Canada',
  },
];

describe('getCountry', () => {
  it('mapeia estados dos EUA para United States', () => {
    expect(getCountry('Cupertino, California')).toBe('United States');
    expect(getCountry('Irving, Texas')).toBe('United States');
    expect(getCountry('Washington, D.C.')).toBe('United States');
  });

  it('remove marcadores de rodapé', () => {
    expect(getCountry('Miami-Dade County, Florida[3]')).toBe('United States');
  });

  it('retorna o país para sedes fora dos EUA', () => {
    expect(getCountry('Ottawa, Canada')).toBe('Canada');
    expect(getCountry('Dublin, Ireland')).toBe('Ireland');
  });

  it('retorna Desconhecido para valores ausentes ou inválidos', () => {
    expect(getCountry(null)).toBe('Desconhecido');
    expect(getCountry('')).toBe('Desconhecido');
    expect(getCountry('none')).toBe('Desconhecido');
  });
});

describe('filterCompanies', () => {
  it('filtra por setor', () => {
    const result = filterCompanies(dataset, { sector: 'spl' });
    expect(result.map((c) => c.symbol)).toEqual(['AAPL', 'XOM']);
  });

  it('filtra por busca (símbolo, nome, subindústria, sede)', () => {
    expect(filterCompanies(dataset, { search: 'msft' }).map((c) => c.symbol)).toEqual(['MSFT']);
    expect(filterCompanies(dataset, { search: 'apple' }).map((c) => c.symbol)).toEqual(['AAPL']);
  });

  it('filtra por país', () => {
    const result = filterCompanies(dataset, { country: 'United States' });
    expect(result.map((c) => c.symbol)).toEqual(['AAPL', 'MSFT', 'XOM']);
    expect(filterCompanies(dataset, { country: 'Canada' }).map((c) => c.symbol)).toEqual(['SHOP']);
  });

  it('filtra por dividend yield mínimo', () => {
    expect(filterCompanies(dataset, { dividendMin: '2' }).map((c) => c.symbol)).toEqual(['XOM']);
    expect(filterCompanies(dataset, { dividendMin: '1' }).map((c) => c.symbol)).toEqual([
      'MSFT',
      'XOM',
    ]);
  });

  it('não quebra com dividendMin vazio', () => {
    expect(filterCompanies(dataset, { dividendMin: '' }).length).toBe(4);
  });

  it('ignora espaços e caixa na busca', () => {
    expect(filterCompanies(dataset, { search: '  XoM ' }).map((c) => c.symbol)).toEqual(['XOM']);
  });

  it('retorna cópia sem mutar o original', () => {
    const original = [...dataset];
    const result = filterCompanies(dataset, { sector: 'spl' });
    expect(dataset).toEqual(original);
    expect(result).not.toBe(dataset);
  });
});

describe('sortCompanies', () => {
  it('ordena por marketCap desc', () => {
    expect(sortCompanies(dataset, 'marketCap-desc').map((c) => c.symbol)).toEqual([
      'AAPL',
      'MSFT',
      'XOM',
      'SHOP',
    ]);
  });

  it('ordena por symbol asc (padrão)', () => {
    expect(sortCompanies(dataset).map((c) => c.symbol)).toEqual(['AAPL', 'MSFT', 'SHOP', 'XOM']);
  });

  it('ordena por dividendYield desc', () => {
    expect(sortCompanies(dataset, 'dividendYield-desc').map((c) => c.symbol)).toEqual([
      'XOM',
      'MSFT',
      'AAPL',
      'SHOP',
    ]);
  });

  it('não muta o array original', () => {
    const original = [...dataset];
    sortCompanies(dataset, 'marketCap-desc');
    expect(dataset).toEqual(original);
  });
});
