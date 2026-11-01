import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAllSectors,
  getResumoDia,
  getSectorIds,
  getSectorName,
  getSectorPayload,
  getSnapshot,
  resetSectorStore,
} from './sector-store.js';

function respostaOk(payload) {
  return Promise.resolve({ ok: true, json: async () => payload });
}

beforeEach(() => {
  resetSectorStore();
});

describe('getSnapshot', () => {
  const snapshot = {
    versao: 'abc123',
    setores: [
      {
        id: 'energy',
        name: 'Energy',
        generatedAt: '2026-10-30T00:00:00Z',
        count: 1,
        companies: [{ symbol: 'XOM', name: 'Exxon' }],
      },
    ],
    resumoDia: { referenceDate: '2026-10-30', stats: { total: 1 } },
  };

  it('devolve o snapshot e alimenta os caches de setores', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ dados: snapshot }));

    const resultado = await getSnapshot();

    expect(resultado).toEqual(snapshot);
    expect(await getSectorIds()).toEqual(['energy']);
    expect(await getSectorPayload('energy')).toEqual({
      sector: 'Energy',
      generatedAt: '2026-10-30T00:00:00Z',
      liveUpdatedAt: null,
      count: 1,
      companies: [{ symbol: 'XOM', name: 'Exxon' }],
    });
    // Só o snapshot foi pedido: a lista e o payload vêm do cache.
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('deduplica pedidos concorrentes e reutiliza o cache', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ dados: snapshot }));

    const [a, b] = await Promise.all([getSnapshot(), getSnapshot()]);
    const c = await getSnapshot();

    expect(a).toEqual(snapshot);
    expect(b).toEqual(snapshot);
    expect(c).toEqual(snapshot);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('force ignora o cache', async () => {
    globalThis.fetch = vi.fn(() => respostaOk({ dados: snapshot }));

    await getSnapshot();
    await getSnapshot({ force: true });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('rejeita payload inválido sem envenenar o cache', async () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementationOnce(() => respostaOk({}))
      .mockImplementationOnce(() => respostaOk({ dados: snapshot }));

    await expect(getSnapshot()).rejects.toThrow('Snapshot inválido');
    await expect(getSnapshot()).resolves.toEqual(snapshot);
  });
});

describe('getResumoDia', () => {
  it('usa o resumo do snapshot sem pedir /api/resumo-dia', async () => {
    const resumo = { referenceDate: '2026-10-30', stats: { total: 3 } };
    globalThis.fetch = vi.fn(() =>
      respostaOk({ dados: { setores: [{ id: 'energy', companies: [] }], resumoDia: resumo } })
    );

    expect(await getResumoDia()).toEqual(resumo);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(String(globalThis.fetch.mock.calls[0][0])).toContain('/api/snapshot');
  });

  it('recorre a /api/resumo-dia quando o snapshot falha', async () => {
    globalThis.fetch = vi.fn((url) => {
      if (String(url).includes('/api/snapshot')) {
        return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
      }
      return respostaOk({ dados: { stats: { total: 7 } } });
    });

    expect(await getResumoDia()).toEqual({ stats: { total: 7 } });
  });
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
