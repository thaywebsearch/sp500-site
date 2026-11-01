import { describe, expect, it, vi } from 'vitest';
import { getPriceHistory, getSectorIntelligence } from './api.js';

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

  it('devolve [] quando registros está ausente', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    expect(await getPriceHistory('AAPL')).toEqual([]);
  });
});

describe('getSectorIntelligence', () => {
  it('devolve o relatório agregado', async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ dados: { sectorCount: 11, sectors: [] } }),
    }));
    expect(await getSectorIntelligence()).toEqual({ sectorCount: 11, sectors: [] });
  });

  it('devolve null em erro HTTP', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 404 }));
    expect(await getSectorIntelligence()).toBeNull();
  });

  it('devolve null quando o fetch rebenta ou dados está ausente', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('rede')));
    expect(await getSectorIntelligence()).toBeNull();

    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    expect(await getSectorIntelligence()).toBeNull();
  });
});
