// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WATCHLIST_KEY = 'sp500-watchlist';
const ALERTS_KEY = 'sp500-price-alerts';
const STOCK_KEY = 'sp500-stock-of-day';

const FULL_HTML = `
  <div id="freshness-badge"><span id="freshness-text"></span></div>
  <button class="nav-tab" data-tab="dashboard"></button>
  <button class="nav-tab" data-tab="treemap"></button>
  <button class="nav-tab" data-tab="heatmap"></button>
  <button class="nav-tab" data-tab="bubble"></button>
  <button class="nav-tab" data-tab="dividends"></button>
  <button class="nav-tab" data-tab="watchlist"></button>
  <button class="nav-tab" data-tab="stock-of-day"></button>
  <button class="nav-tab" data-tab="daily-curiosity"></button>
  <div id="dashboard-view"></div>
  <div id="treemap-view"></div>
  <div id="heatmap-view"></div>
  <div id="bubble-chart-view"></div>
  <div id="dividends-view"></div>
  <div id="watchlist-view"></div>
  <div id="stock-of-day-view"></div>
  <div id="daily-curiosity-view"></div>
  <div id="daily-summary"></div>
  <select id="sector-filter"></select>
  <select id="country-filter"></select>
  <input id="search-input" />
  <input id="dividend-min" />
  <select id="sort-select">
    <option value="symbol-asc">Símbolo</option>
    <option value="marketCap-desc">Market Cap</option>
  </select>
  <table><tbody id="table-body"></tbody></table>
  <div id="stats"></div>
  <div id="pagination"></div>
  <input type="checkbox" id="header-checkbox" />
  <button id="select-all"></button>
  <button id="deselect-all"></button>
  <button id="export-csv"></button>
  <button id="export-json"></button>
  <span data-watchlist-count>0</span>
`;

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

function company(symbol, opts = {}) {
  return {
    symbol,
    name: opts.name || `${symbol} Incorporated`,
    subIndustry: opts.subIndustry || 'Software',
    headquarters: opts.headquarters || 'USA',
    marketCap: opts.marketCap ?? 1e11,
    dividendYield: opts.dividendYield ?? 2,
  };
}

function defaultSectors() {
  return {
    energy: [
      company('XOM', { marketCap: 4e11, dividendYield: 3.2 }),
      company('CVX', { marketCap: 2e11, dividendYield: 4.1 }),
      company('COP', { marketCap: 1.2e11, dividendYield: 1.8 }),
    ],
    technology: [
      company('AAPL', {
        marketCap: 3e12,
        dividendYield: 0.5,
        subIndustry: 'Consumer Electronics',
      }),
      company('MSFT', { marketCap: 2.8e12, dividendYield: 0.7, subIndustry: 'Software' }),
    ],
  };
}

function routesFor(sectors, generatedAt = new Date().toISOString()) {
  const routes = { '/api/setores': { setores: Object.keys(sectors) } };
  for (const [id, companies] of Object.entries(sectors)) {
    routes[`/api/setor/${id}`] = { dados: { generatedAt, companies } };
  }
  routes['/api/resumo-dia'] = { dados: { stats: { gainers: 1 }, marketMood: 'bullish' } };
  return routes;
}

function makeFetch(routes) {
  return vi.fn((url) => {
    const u = String(url);
    const key = Object.keys(routes).find((k) => u.includes(k));
    if (!key) return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
    const value = routes[key];
    if (value && value.__reject) return Promise.reject(new Error('network'));
    if (value && value.__status) {
      return Promise.resolve({ ok: false, status: value.__status, json: async () => ({}) });
    }
    return Promise.resolve({ ok: true, json: async () => value });
  });
}

async function boot({ html = FULL_HTML, routes, storage = {} } = {}) {
  document.body.innerHTML = html;
  localStorage.clear();
  for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value);
  globalThis.fetch = makeFetch(routes || routesFor(defaultSectors()));
  vi.resetModules();
  const main = await import('./main.js');
  main.initDashboard();
  await settle();
  await settle();
  return main;
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('carregamento e renderização', () => {
  it('carrega dados, preenche tabela, filtros e estatísticas', async () => {
    await boot();
    expect(document.querySelectorAll('#table-body tr')).toHaveLength(5);
    expect(document.getElementById('stats').textContent).toContain('Total: 5');
    expect(document.querySelectorAll('#sector-filter option')).toHaveLength(3);
    expect(document.getElementById('freshness-text').textContent).toContain('Dados de');
  });

  it('aplica filtros de setor, país, pesquisa e dividendo', async () => {
    const main = await boot();
    const sectorFilter = document.getElementById('sector-filter');
    sectorFilter.value = 'energy';
    sectorFilter.dispatchEvent(new Event('change'));
    expect(document.getElementById('stats').textContent).toContain('Total: 3');

    const countryFilter = document.getElementById('country-filter');
    countryFilter.value = countryFilter.options[1].value;
    countryFilter.dispatchEvent(new Event('change'));
    expect(document.getElementById('stats').textContent).toContain('Total: 3');

    countryFilter.value = '';
    sectorFilter.value = '';
    main.applyFilters();
    expect(document.getElementById('stats').textContent).toContain('Total: 5');

    document.getElementById('search-input').value = 'aapl';
    main.applyFilters();
    expect(document.getElementById('stats').textContent).toContain('Total: 1');

    document.getElementById('search-input').value = '';
    document.getElementById('dividend-min').value = '4';
    main.applyFilters();
    expect(document.getElementById('stats').textContent).toContain('Total: 1');
  });

  it('ordena por market cap desc', async () => {
    const main = await boot();
    const sortSelect = document.getElementById('sort-select');
    sortSelect.value = 'marketCap-desc';
    sortSelect.dispatchEvent(new Event('change'));
    expect(document.querySelector('#table-body tr td strong').textContent).toBe('AAPL');
    expect(main.renderTable).toBeTypeOf('function');
  });

  it('seleciona/desseleciona tudo e pelo cabeçalho', async () => {
    await boot();
    document.getElementById('select-all').click();
    expect(document.getElementById('stats').textContent).toContain('Selecionadas: 5');

    const header = document.getElementById('header-checkbox');
    header.checked = false;
    header.dispatchEvent(new Event('change'));
    expect(document.getElementById('stats').textContent).toContain('Selecionadas: 0');

    header.checked = true;
    header.dispatchEvent(new Event('change'));
    expect(document.getElementById('stats').textContent).toContain('Selecionadas: 5');

    document.getElementById('deselect-all').click();
    expect(document.getElementById('stats').textContent).toContain('Selecionadas: 0');
  });

  it('pagina os resultados', async () => {
    const companies = Array.from({ length: 60 }, (_, i) =>
      company(`SYM${String(i).padStart(3, '0')}`, { marketCap: 1e11 + i })
    );
    await boot({ routes: routesFor({ energy: companies }) });
    expect(document.getElementById('pagination').textContent).toContain('Página 1 de 2');
    expect(document.querySelectorAll('#table-body tr')).toHaveLength(50);

    let [prev, next] = document.querySelectorAll('#pagination button');
    expect(prev.disabled).toBe(true);
    next.click();
    expect(document.getElementById('pagination').textContent).toContain('Página 2 de 2');
    expect(document.querySelectorAll('#table-body tr')).toHaveLength(10);

    [prev, next] = document.querySelectorAll('#pagination button');
    expect(next.disabled).toBe(true);
    prev.click();
    expect(document.getElementById('pagination').textContent).toContain('Página 1 de 2');
  });

  it('ignora setor que falha e setor sem empresas', async () => {
    const routes = {
      '/api/setores': { setores: ['energy', 'technology', 'health-care'] },
      '/api/setor/energy': { dados: { companies: [company('XOM')] } },
      '/api/setor/technology': { __reject: true },
      '/api/setor/health-care': { dados: {} },
      '/api/resumo-dia': { dados: {} },
    };
    await boot({ routes });
    expect(document.getElementById('stats').textContent).toContain('Total: 1');
  });

  it('mostra erro quando o carregamento falha', async () => {
    await boot({ routes: {} });
    expect(document.getElementById('stats').textContent).toContain('Erro ao carregar dados');
    expect(document.getElementById('freshness-text').textContent).toBe('Data indisponível');
  });

  it('atualiza o badge de frescura conforme a idade dos dados', async () => {
    const main = await boot();
    const badge = document.getElementById('freshness-badge');
    const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

    globalThis.fetch = makeFetch(routesFor({ energy: [company('A')] }, daysAgo(2)));
    await main.loadDashboardData();
    expect(badge.classList.contains('fd-fresh')).toBe(true);

    globalThis.fetch = makeFetch(routesFor({ energy: [company('A')] }, daysAgo(10)));
    await main.loadDashboardData();
    expect(badge.classList.contains('fd-aging')).toBe(true);

    globalThis.fetch = makeFetch(routesFor({ energy: [company('A')] }, daysAgo(40)));
    await main.loadDashboardData();
    expect(badge.classList.contains('fd-stale')).toBe(true);

    main.updateFreshnessBadge(['data-invalida']);
    expect(document.getElementById('freshness-text').textContent).toBe('Data indisponível');
  });

  it('escapa HTML e mostra N/A para quem não paga dividendos', async () => {
    const routes = routesFor({
      energy: [
        {
          symbol: 'A<b>',
          name: 'Empresa <script>alert(1)</script>',
          subIndustry: '<i>oil</i>',
          headquarters: 'A, Texas',
          marketCap: 1e11,
          hasDividend: 'Não',
          dividendYield: 0,
        },
        company('PAY', { marketCap: 2e11, dividendYield: 2 }),
      ],
    });
    await boot({ routes });

    const html = document.getElementById('table-body').innerHTML;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('N/A');
    expect(html).toContain('2.00%');
  });

  it('mantém o header-checkbox sincronizado', async () => {
    await boot();
    const header = document.getElementById('header-checkbox');
    expect(header.checked).toBe(false);

    const first = document.querySelector('#table-body .row-checkbox');
    first.checked = true;
    first.dispatchEvent(new Event('change'));
    expect(header.indeterminate).toBe(true);
    expect(header.checked).toBe(false);

    document.getElementById('select-all').click();
    expect(header.checked).toBe(true);
    expect(header.indeterminate).toBe(false);

    document.getElementById('deselect-all').click();
    expect(header.checked).toBe(false);
  });
});

describe('navegação e watchlist', () => {
  it('navega entre todas as abas', async () => {
    const main = await boot();

    main.setActiveTab('treemap');
    expect(document.getElementById('treemap-view').style.display).not.toBe('none');
    await settle();
    expect(document.getElementById('treemap-view').innerHTML).toContain('Mapa de Setores');

    main.setActiveTab('heatmap');
    await settle();
    expect(document.getElementById('heatmap-view').innerHTML).toContain('Heatmap');

    main.setActiveTab('bubble');
    expect(document.querySelector('#bubble-chart-view svg')).toBeTruthy();

    main.setActiveTab('dividends');
    expect(document.getElementById('dividends-view').style.display).toBe('block');
    expect(document.getElementById('dividends-view').innerHTML).toContain('Dividendos');

    main.setActiveTab('daily-curiosity');
    await settle();
    expect(document.getElementById('daily-curiosity-view').innerHTML).not.toBe('');

    main.setActiveTab('stock-of-day');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(document.getElementById('stock-of-day-view').innerHTML).toContain('Ação do Dia');

    main.setActiveTab('dashboard');
    expect(document.getElementById('dashboard-view').style.display).toBe('block');

    main.setActiveTab('desconhecida');
    expect(document.getElementById('dashboard-view').style.display).toBe('block');
  });

  it('adiciona/remove da watchlist e mostra a view', async () => {
    const main = await boot();
    const btn = document.querySelector('#table-body .btn-watchlist');
    const symbol = btn.dataset.symbol;

    btn.click();
    expect(document.querySelector('[data-watchlist-count]').textContent).toBe('1');
    main.setActiveTab('watchlist');
    expect(document.getElementById('watchlist-view').innerHTML).toContain(symbol);

    document.querySelector(`#table-body .btn-watchlist[data-symbol="${symbol}"]`).click();
    expect(document.querySelector('[data-watchlist-count]').textContent).toBe('0');
    main.setActiveTab('watchlist');
    expect(document.getElementById('watchlist-view').innerHTML).toContain('Nenhuma empresa');
  });

  it('não refaz fetch ao reabrir abas já carregadas', async () => {
    const main = await boot();
    main.setActiveTab('treemap');
    await settle();
    await settle();
    const callsAfterFirst = globalThis.fetch.mock.calls.length;

    main.setActiveTab('dashboard');
    main.setActiveTab('treemap');
    await settle();
    expect(globalThis.fetch.mock.calls.length).toBe(callsAfterFirst);
  });
});

describe('ação do dia', () => {
  it('gera, guarda em cache e reutiliza', async () => {
    const main = await boot();
    await main.loadStockOfDay();
    const view = document.getElementById('stock-of-day-view');
    expect(view.innerHTML).toContain('Ação do Dia');
    expect(localStorage.getItem(STOCK_KEY)).toBeTruthy();

    await main.loadStockOfDay();
    expect(view.innerHTML).toContain('Ação do Dia');
  });

  it('mostra aviso quando não há empresas', async () => {
    const main = await boot({ routes: {} });
    await main.loadStockOfDay();
    expect(document.getElementById('stock-of-day-view').innerHTML).toContain('Dados indisponíveis');
  });

  it('renderStockOfDay sem primary mostra aviso', async () => {
    const main = await boot();
    const el = document.createElement('div');
    main.renderStockOfDay(el, { primary: null, alternatives: [], marketContext: {} });
    expect(el.innerHTML).toContain('Sem dados suficientes');
  });

  it('getMarketContext cobre os três níveis', async () => {
    const main = await boot();
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0);
    expect(main.getMarketContext().level).toBe('Calmo');
    spy.mockReturnValueOnce(0.3);
    expect(main.getMarketContext().level).toBe('Moderado');
    spy.mockReturnValueOnce(0.9);
    expect(main.getMarketContext().level).toBe('Elevado');
  });

  it('cacheStockOfDay e getCachedStockOfDay', async () => {
    const main = await boot();
    main.cacheStockOfDay('2026-01-01', { date: '2026-01-01', primary: { symbol: 'X' } });
    expect(main.getCachedStockOfDay('2026-01-01').primary.symbol).toBe('X');
    expect(main.getCachedStockOfDay('2026-01-02')).toBeNull();
    localStorage.setItem(STOCK_KEY, 'nao-json');
    expect(main.getCachedStockOfDay('2026-01-01')).toBeNull();
  });
});

describe('exportação', () => {
  it('exporta CSV e JSON', async () => {
    const createSpy = vi.fn(() => 'blob:url');
    const revokeSpy = vi.fn();
    globalThis.URL.createObjectURL = createSpy;
    globalThis.URL.revokeObjectURL = revokeSpy;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await boot();
    document.getElementById('export-csv').click();
    document.getElementById('export-json').click();

    expect(createSpy).toHaveBeenCalledTimes(2);
    expect(clickSpy).toHaveBeenCalledTimes(2);
    expect(revokeSpy).toHaveBeenCalledTimes(2);
  });
});

describe('alertas de preço', () => {
  it('cria, valida e cancela alertas', async () => {
    globalThis.prompt = vi.fn(() => '150.25');
    globalThis.confirm = vi.fn(() => true);
    globalThis.alert = vi.fn();
    const main = await boot();

    main.setPriceAlertPrompt('aapl');
    expect(localStorage.getItem(ALERTS_KEY)).toContain('AAPL');

    globalThis.prompt = vi.fn(() => 'abc');
    main.setPriceAlertPrompt('msft');
    expect(globalThis.alert).toHaveBeenCalled();

    globalThis.prompt = vi.fn(() => '');
    main.setPriceAlertPrompt('msft');

    expect(main.setPriceAlert('', 10, 'above')).toBe(false);
    expect(main.setPriceAlert('X', 'no', 'above')).toBe(false);
    expect(main.setPriceAlert('X', 10, 'sideways')).toBe(false);
  });

  it('remove alerta já disparado', async () => {
    const stored = JSON.stringify([['AAPL', { target: 100, direction: 'above', triggered: true }]]);
    globalThis.confirm = vi.fn(() => true);
    globalThis.prompt = vi.fn();
    const main = await boot({ storage: { [ALERTS_KEY]: stored } });

    main.setPriceAlertPrompt('AAPL');
    expect(globalThis.prompt).not.toHaveBeenCalled();
    expect(main.loadPriceAlerts()).toEqual([]);
  });

  it('loadPriceAlerts aceita formato de objetos', async () => {
    const stored = JSON.stringify([
      { symbol: 'ZZ', target: 5, direction: 'below', triggered: false },
    ]);
    const main = await boot({ storage: { [ALERTS_KEY]: stored } });
    expect(main.loadPriceAlerts()).toEqual([['ZZ', expect.objectContaining({ target: 5 })]]);
  });

  it('loadPriceAlerts tolera conteúdo inválido', async () => {
    const main = await boot({ storage: { [ALERTS_KEY]: 'nao-json' } });
    expect(main.loadPriceAlerts()).toEqual([]);
  });

  it('loadWatchlist lê e tolera erros', async () => {
    const main = await boot({ storage: { [WATCHLIST_KEY]: JSON.stringify(['AAPL']) } });
    expect(main.loadWatchlist()).toEqual(['AAPL']);
    localStorage.setItem(WATCHLIST_KEY, '{invalido');
    expect(main.loadWatchlist()).toEqual([]);
  });

  it('saveWatchlist/savePriceAlerts toleram erro de escrita', async () => {
    const main = await boot();
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => main.toggleWatchlist('AAPL')).not.toThrow();
    expect(() => main.setPriceAlert('AAPL', 10, 'above')).not.toThrow();
    spy.mockRestore();
  });

  it('startPriceAlertPolling verifica alertas periodicamente', async () => {
    const main = await boot();
    main.setPriceAlert('AAPL', 100, 'above');
    vi.useFakeTimers();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    main.startPriceAlertPolling();
    await vi.advanceTimersByTimeAsync(60000);
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('checkPriceAlerts dispara e marca o alerta atingido', async () => {
    const routes = routesFor(defaultSectors());
    routes['/api/historico/AAPL'] = { registros: [{ data: '2026-10-01', close: 150 }] };
    globalThis.alert = vi.fn();
    const main = await boot({ routes });

    main.setPriceAlert('AAPL', 100, 'above');
    const triggered = await main.checkPriceAlerts();

    expect(triggered).toHaveLength(1);
    expect(globalThis.alert).toHaveBeenCalled();
    expect(main.loadPriceAlerts()).toEqual([
      ['AAPL', expect.objectContaining({ triggered: true, triggeredPrice: 150 })],
    ]);
  });

  it('checkPriceAlerts não dispara sem preço válido', async () => {
    globalThis.alert = vi.fn();
    const main = await boot();

    main.setPriceAlert('ZZ', 10, 'below');
    const triggered = await main.checkPriceAlerts();

    expect(triggered).toEqual([]);
    expect(globalThis.alert).not.toHaveBeenCalled();
  });
});

describe('guardas e utilitários', () => {
  it('não rebenta quando faltam elementos', async () => {
    const main = await boot({ html: '<div id="dashboard-view"></div>' });
    expect(() => main.renderTable()).not.toThrow();
    expect(() => main.renderPagination()).not.toThrow();
    expect(() => main.updateStats()).not.toThrow();
    expect(() => main.updateWatchlistCountBadge()).not.toThrow();
    await expect(main.loadWatchlistData()).resolves.toBeUndefined();
    expect(() => main.loadBubbleChart()).not.toThrow();
    await expect(main.loadStockOfDay()).resolves.toBeUndefined();
  });

  it('debounce adia a execução', async () => {
    vi.useFakeTimers();
    vi.resetModules();
    const main = await import('./main.js');
    const fn = vi.fn();
    const debounced = main.debounce(fn, 100);
    debounced('a');
    debounced('b');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });
});
