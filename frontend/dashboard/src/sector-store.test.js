import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAllSectors,
  getSectorIds,
  getSectorName,
  getSectorPayload,
  resetSectorStore,
} from './sector-store.js';

function respostaOk(payload) {
  return Promise.resolve({ ok: true, json: async () => payload });
}

beforeEach(() => {
  resetSectorStore();
});

describe('getSectorIds', () => {
  it('devolve os ids e reutiliza o cache na chamada seguinte', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ setores: ['energy', 'financials'] }));

    expect(await getSectorIds()).toEqual(['energy', 'financials']);
    expect(await getSectorIds()).toEqual(['energy', 'financials']);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('partilha a Promise quando há pedidos simultâneos', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ setores: ['energy'] }));

    const [a, b, c] = await Promise.all([getSectorIds(), getSectorIds(), getSectorIds()]);

    expect(a).toEqual(['energy']);
    expect(b).toEqual(['energy']);
    expect(c).toEqual(['energy']);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('force ignora o cache', async () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementationOnce(() => respostaOk({ setores: ['energy'] }))
      .mockImplementationOnce(() => respostaOk({ setores: ['utilities'] }));

    expect(await getSectorIds()).toEqual(['energy']);
    expect(await getSectorIds({ force: true })).toEqual(['utilities']);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('getSectorPayload', () => {
  it('devolve o bloco dados e deduplica pedidos concorrentes', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ dados: { companies: [{ symbol: 'XOM' }] } }));

    const [a, b] = await Promise.all([getSectorPayload('energy'), getSectorPayload('energy')]);

    expect(a).toEqual({ companies: [{ symbol: 'XOM' }] });
    expect(b).toEqual(a);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('propaga o erro e não deixa a Promise presa no cache', async () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500 }))
      .mockImplementationOnce(() => respostaOk({ dados: { companies: [] } }));

    await expect(getSectorPayload('energy')).rejects.toThrow('HTTP 500');
    await expect(getSectorPayload('energy')).resolves.toEqual({ companies: [] });
  });
});

describe('getAllSectors', () => {
  it('agrega nome, companies e generatedAt de cada setor', async () => {
    globalThis.fetch = vi.fn((url) => {
      if (String(url).includes('/api/setores')) return respostaOk({ setores: ['energy'] });
      return respostaOk({
        dados: { generatedAt: '2026-10-01T00:00:00Z', companies: [{ symbol: 'XOM' }] },
      });
    });

    const setores = await getAllSectors();

    expect(setores).toEqual([
      {
        id: 'energy',
        name: 'Energy',
        companies: [{ symbol: 'XOM' }],
        generatedAt: '2026-10-01T00:00:00Z',
      },
    ]);
  });

  it('tolera setores que falham sem rebentar a lista', async () => {
    globalThis.fetch = vi.fn((url) => {
      if (String(url).includes('/api/setores')) {
        return respostaOk({ setores: ['energy', 'utilities'] });
      }
      if (String(url).includes('/api/setor/energy'))
        return respostaOk({ dados: { companies: [] } });
      return Promise.resolve({ ok: false, status: 500, json: async () => ({}) });
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const setores = await getAllSectors();

    expect(setores).toHaveLength(2);
    expect(setores[1]).toEqual({
      id: 'utilities',
      name: 'Utilities',
      companies: [],
      generatedAt: null,
    });
  });
});

describe('getSectorName', () => {
  it('traduz o id para o nome GICS e usa o id como fallback', () => {
    expect(getSectorName('information-technology')).toBe('Information Technology');
    expect(getSectorName('desconhecido')).toBe('desconhecido');
  });
});
