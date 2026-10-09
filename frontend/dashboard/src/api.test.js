import { describe, expect, it, vi } from 'vitest';
import { getDailySummary, getPriceHistory, healthCheck } from './api.js';

describe('getPriceHistory', () => {
  it('devolve os registos', async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ registros: [{ close: 1 }] }),
    }));
    expect(await getPriceHistory('AAPL')).toEqual([{ close: 1 }]);
  });

  it('devolve [] em erro HTTP', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 500 }));
    expect(await getPriceHistory('AAPL')).toEqual([]);
  });

  it('devolve [] quando o fetch rebenta', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('rede')));
    expect(await getPriceHistory('AAPL')).toEqual([]);
  });
});

describe('getDailySummary', () => {
  it('devolve os dados', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ dados: { a: 1 } }) }));
    expect(await getDailySummary()).toEqual({ a: 1 });
  });

  it('devolve {} em erro', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 500 }));
    expect(await getDailySummary()).toEqual({});
  });
});

describe('healthCheck', () => {
  it('devolve true quando o servidor responde', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true }));
    expect(await healthCheck()).toBe(true);
  });

  it('devolve false quando o fetch rebenta', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('rede')));
    expect(await healthCheck()).toBe(false);
  });
});
