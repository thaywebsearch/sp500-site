// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './config.js';
import { renderBubbleChart } from './bubble-chart.js';
import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { loadDailySummary } from './daily-summary.js';
import { loadCuriosidades } from './daily-curiosity.js';
import { openCompanyDetails } from './company-details.js';
import { openPriceChart } from './price-chart.js';

function mockFetch(routes) {
  globalThis.fetch = vi.fn((url) => {
    const u = String(url);
    const hit = Object.keys(routes).find((key) => u.includes(key));
    if (!hit) return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
    const value = routes[hit];
    if (value.ok === false) {
      return Promise.resolve({ ok: false, status: value.status || 500, json: async () => ({}) });
    }
    return Promise.resolve({ ok: true, json: async () => value });
  });
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('renderBubbleChart', () => {
  it('desenha o SVG quando há dados válidos', () => {
    document.body.innerHTML = '<div id="bubble"></div>';
    renderBubbleChart(
      [
        {
          symbol: 'AAPL',
          name: 'Apple',
          sectorName: 'Information Technology',
          marketCap: 3e12,
          dividendYield: 0.5,
        },
      ],
      'bubble'
    );
    expect(document.querySelector('#bubble svg')).toBeTruthy();
    expect(document.querySelector('#bubble').textContent).toContain('Setores');
  });

  it('mostra aviso quando não há dados válidos', () => {
    document.body.innerHTML = '<div id="bubble"></div>';
    renderBubbleChart([], 'bubble');
    expect(document.querySelector('#bubble').innerHTML).toContain('Sem dados');
  });

  it('não rebenta se o contentor não existir', () => {
    expect(() =>
      renderBubbleChart([{ symbol: 'X', sectorName: 'S', marketCap: 1 }], 'ausente')
    ).not.toThrow();
  });
});

describe('loadTreemap', () => {
  it('renderiza os cartões dos setores', async () => {
    document.body.innerHTML = '<div id="treemap-view"></div>';
    mockFetch({
      '/api/setores': { setores: ['energy'] },
      '/api/setor/energy': {
        dados: {
          companies: [{ symbol: 'XOM', marketCap: 4e11, dividendYield: 3, hasDividend: 'Sim' }],
        },
      },
    });
    await loadTreemap();
    const el = document.getElementById('treemap-view');
    expect(el.innerHTML).toContain('Mapa de Setores');
    expect(el.innerHTML).toContain('XOM');
  });

  it('mostra erro quando o fetch rebenta', async () => {
    document.body.innerHTML = '<div id="treemap-view"></div>';
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('boom')));
    await loadTreemap();
    expect(document.getElementById('treemap-view').innerHTML).toContain(
      'Erro ao carregar mapa de setores'
    );
  });
});

describe('loadHeatmap', () => {
  it('renderiza os líderes por setor', async () => {
    document.body.innerHTML = '<div id="heatmap-view"></div>';
    mockFetch({
      '/api/setores': { setores: ['energy'] },
      '/api/setor/energy': {
        dados: {
          companies: [{ symbol: 'XOM', name: 'Exxon', marketCap: 4e11, dividendYield: 3 }],
        },
      },
    });
    await loadHeatmap();
    const el = document.getElementById('heatmap-view');
    expect(el.innerHTML).toContain('Heatmap - Top 4');
    expect(el.innerHTML).toContain('XOM');
  });
});

describe('loadDailySummary', () => {
  it('renderiza o resumo', async () => {
    document.body.innerHTML = '<div id="daily-summary"></div>';
    mockFetch({ '/api/resumo-dia': { dados: { stats: { gainers: 1 }, marketMood: 'bullish' } } });
    await loadDailySummary();
    expect(document.getElementById('daily-summary').innerHTML).toContain('Otimista');
  });

  it('mostra indisponível em erro HTTP', async () => {
    document.body.innerHTML = '<div id="daily-summary"></div>';
    mockFetch({ '/api/resumo-dia': { ok: false, status: 500 } });
    await loadDailySummary();
    expect(document.getElementById('daily-summary').innerHTML).toContain('indisponível');
  });

  it('ignora contentor ausente', async () => {
    await expect(loadDailySummary('inexistente')).resolves.toBeUndefined();
  });
});

describe('loadCuriosidades', () => {
  const dados = {
    sucesso: true,
    dados: {
      total: 1,
      proximaEmpresa: 'Microsoft',
      ordem: 'alfabética',
      curiosidades: [
        {
          simbolo: 'AAPL',
          posicao: 1,
          empresa: 'Apple',
          setor: 'Tech',
          titulo: 'T',
          descricao: 'D',
        },
      ],
    },
  };

  it('renderiza a curiosidade do dia', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({ '/api/curiosidades': dados });
    await loadCuriosidades();
    expect(document.getElementById('daily-curiosity-view').innerHTML).toContain('Apple');
  });

  it('mostra erro de formato inválido', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({ '/api/curiosidades': { sucesso: false } });
    await loadCuriosidades();
    expect(document.getElementById('daily-curiosity-view').innerHTML).toContain(
      'Formato de dados inválido'
    );
  });

  it('ignora ausência do contentor', async () => {
    await expect(loadCuriosidades()).resolves.toBeUndefined();
  });
});

describe('openCompanyDetails', () => {
  it('abre o modal e fecha no botão', () => {
    openCompanyDetails({ symbol: 'AAPL', name: 'Apple', dividendYield: 0.5, marketCap: 3e12 });
    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay.innerHTML).toContain('AAPL');
    overlay.querySelector('.modal-close').click();
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });

  it('fecha o modal com a tecla Escape', () => {
    openCompanyDetails({ symbol: 'MSFT', name: 'Microsoft' });
    expect(document.querySelector('.modal-overlay')).toBeTruthy();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });
});

describe('openPriceChart', () => {
  it('mostra estatísticas e gráfico', async () => {
    mockFetch({
      '/api/historico/AAPL': {
        registros: [
          { data: '2024-01-01', close: 100 },
          { data: '2024-01-02', close: 110 },
        ],
      },
    });
    await openPriceChart('AAPL', 'Apple');
    const body = document.getElementById('price-chart-body');
    expect(body.innerHTML).toContain('pregões');
    expect(body.innerHTML).toContain('<svg');
  });

  it('mostra aviso quando não há registos', async () => {
    mockFetch({ '/api/historico/AAPL': { registros: [] } });
    await openPriceChart('AAPL', 'Apple');
    expect(document.getElementById('price-chart-body').innerHTML).toContain('Nenhum dado de preço');
  });
});
