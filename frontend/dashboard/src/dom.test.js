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

  it('mostra tooltip no hover e esconde no mouseout', () => {
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
        { symbol: 'XOM', name: 'Exxon', sectorName: 'Energy', marketCap: 5e9, dividendYield: 3.2 },
        { symbol: 'TINY', name: 'Tiny', sectorName: 'Energy', marketCap: 5e8, dividendYield: 1 },
      ],
      'bubble'
    );
    const base = document.body.children.length;
    document.querySelectorAll('#bubble circle').forEach((circle) => {
      circle.dispatchEvent(new MouseEvent('mouseover'));
      expect(document.body.children.length).toBe(base + 1);
      circle.dispatchEvent(new MouseEvent('mouseout'));
      expect(document.body.children.length).toBe(base);
    });
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

  it('marca setor indisponível quando o id é desconhecido', async () => {
    document.body.innerHTML = '<div id="treemap-view"></div>';
    mockFetch({
      '/api/setores': { setores: ['setor-novo'] },
      '/api/setor/setor-novo': {
        dados: {
          companies: [{ symbol: 'ABC', marketCap: 1e11, dividendYield: 1, hasDividend: 'Não' }],
        },
      },
    });
    await loadTreemap();
    const html = document.getElementById('treemap-view').innerHTML;
    expect(html).toContain('not-allowed');
    expect(html).toContain('Em Desenvolvimento');
  });

  it('navega para o setor ou alerta quando indisponível', async () => {
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
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    window.navigateToSector('http://x/sector.html?sector=energy', 'energy');
    expect(openSpy).toHaveBeenCalledWith('http://x/sector.html?sector=energy', '_blank');

    window.navigateToSector('#', 'setor-novo');
    expect(alertSpy).toHaveBeenCalled();
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

  it('usa cores por faixa de market cap e trata erro', async () => {
    document.body.innerHTML = '<div id="heatmap-view"></div>';
    mockFetch({
      '/api/setores': { setores: ['energy'] },
      '/api/setor/energy': {
        dados: {
          companies: [
            { symbol: 'A', name: 'A', marketCap: 6e11, dividendYield: 1 },
            { symbol: 'B', name: 'B', marketCap: 2.5e11, dividendYield: 1 },
            { symbol: 'C', name: 'C', marketCap: 1.5e11, dividendYield: 1 },
            { symbol: 'D', name: 'D', marketCap: 6e10, dividendYield: 1 },
            { symbol: 'E', name: 'E', marketCap: 4e10, dividendYield: 1 },
          ],
        },
      },
    });
    await loadHeatmap();
    const html = document.getElementById('heatmap-view').innerHTML;
    expect(html).toContain('#ff5252');
    expect(html).toContain('#ff9800');
    expect(html).toContain('#ffeb3b');
    expect(html).toContain('#8bc34a');

    globalThis.fetch = vi.fn(() => Promise.reject(new Error('boom')));
    await loadHeatmap();
    expect(document.getElementById('heatmap-view').innerHTML).toContain('Erro ao carregar heatmap');
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

  it('usa fallback quando o payload não traz dados', async () => {
    document.body.innerHTML = '<div id="daily-summary"></div>';
    mockFetch({ '/api/resumo-dia': {} });
    await loadDailySummary();
    expect(document.getElementById('daily-summary').innerHTML).toContain('Resumo do Dia');
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

  it('renderiza curiosidade completa com fatos, dados, link e progresso', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({
      '/api/curiosidades': {
        sucesso: true,
        dados: {
          total: 10,
          proximaEmpresa: 'Alphabet',
          ordem: 'alfabética',
          curiosidades: [
            {
              simbolo: 'AAPL',
              posicao: 3,
              empresa: 'Apple',
              setor: 'Tech',
              titulo: 'T',
              descricao: 'D',
              fatos: ['fato-1', 'fato-2'],
              dividendYield: '0.5%',
              marketCap: '$3T',
              insight: 'Insight',
              link: 'https://exemplo.com',
              dataAdicao: '2020-01-01',
            },
          ],
        },
      },
    });
    await loadCuriosidades();
    const html = document.getElementById('daily-curiosity-view').innerHTML;
    expect(html).toContain('fato-1');
    expect(html).toContain('Dividend Yield');
    expect(html).toContain('Market Cap');
    expect(html).toContain('btn-saibamais');
    expect(html).toContain('de 10');
  });

  it('mostra erro HTTP', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({ '/api/curiosidades': { ok: false, status: 500 } });
    await loadCuriosidades();
    expect(document.getElementById('daily-curiosity-view').innerHTML).toContain(
      'Erro ao carregar curiosidades'
    );
  });

  it('mostra aviso quando a lista está vazia', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({ '/api/curiosidades': { sucesso: true, dados: { curiosidades: [], total: 0 } } });
    await loadCuriosidades();
    expect(document.getElementById('daily-curiosity-view').innerHTML).toContain(
      'Nenhuma curiosidade disponível'
    );
  });

  it('trata erro de rede', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('down')));
    await loadCuriosidades();
    expect(document.getElementById('daily-curiosity-view').innerHTML).toContain(
      'Erro ao carregar:'
    );
  });

  it('compartilha via navigator.share e via clipboard', async () => {
    document.body.innerHTML = '<div id="daily-curiosity-view"></div>';
    mockFetch({ '/api/curiosidades': dados });
    await loadCuriosidades();

    const share = vi.fn(() => Promise.resolve());
    globalThis.navigator.share = share;
    window.compartilharCuriosidade();
    expect(share).toHaveBeenCalled();

    globalThis.navigator.share = undefined;
    const writeText = vi.fn(() => Promise.resolve());
    globalThis.navigator.clipboard = { writeText };
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    window.compartilharCuriosidade();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(writeText).toHaveBeenCalled();

    globalThis.navigator.clipboard = { writeText: vi.fn(() => Promise.reject(new Error('nope'))) };
    window.compartilharCuriosidade();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao copiar'));
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

  it('abre o gráfico de preços a partir do botão', async () => {
    mockFetch({ '/api/historico/AAPL': { registros: [{ data: '2024-01-01', close: 100 }] } });
    openCompanyDetails({ symbol: 'AAPL', name: 'Apple' });
    document.getElementById('details-chart-btn').click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.getElementById('price-chart-body')).toBeTruthy();
  });

  it('fecha ao clicar no overlay e substitui modal anterior', () => {
    openCompanyDetails({ symbol: 'AAA' });
    openCompanyDetails({ symbol: 'BBB' });
    expect(document.querySelectorAll('.modal-overlay').length).toBe(1);
    const overlay = document.querySelector('.modal-overlay');
    expect(overlay.textContent).toContain('BBB');
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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

  it('fecha ao clicar no overlay e com Escape', async () => {
    mockFetch({ '/api/historico/AAPL': { registros: [{ data: '2024-01-01', close: 100 }] } });
    await openPriceChart('AAPL', 'Apple');
    const overlay = document.querySelector('.modal-overlay');
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.querySelector('.modal-overlay')).toBeNull();

    await openPriceChart('AAPL', 'Apple');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });

  it('mostra erro quando o histórico está corrompido', async () => {
    mockFetch({ '/api/historico/AAPL': { registros: [null] } });
    await openPriceChart('AAPL', 'Apple');
    expect(document.getElementById('price-chart-body').innerHTML).toContain(
      'Erro ao carregar o histórico'
    );
  });
});
