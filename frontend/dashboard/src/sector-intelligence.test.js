// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildSectorIntelligence,
  buildSectorMetrics,
  classifyConcentration,
  classifyIncomeProfile,
  formatHhi,
  formatShare,
  hhi,
  median,
  renderSectorIntelligence,
  sortSectorMetrics,
} from './sector-intelligence.js';

const company = (symbol, marketCap, dividendYield, subIndustry = 'Software') => ({
  symbol,
  name: `${symbol} Corp`,
  marketCap,
  dividendYield,
  subIndustry,
});

const SECTOR_A = {
  id: 'alpha',
  name: 'Alpha',
  generatedAt: '2026-10-01',
  companies: [
    company('AAA', 600, 2, 'Software'),
    company('BBB', 300, 0, 'Software'),
    company('CCC', 100, 4, 'Hardware'),
  ],
};

const SECTOR_B = {
  id: 'beta',
  name: 'Beta',
  generatedAt: '2026-10-21',
  companies: [
    company('DDD', 1000, 0),
    company('EEE', 1000, 0),
    company('FFF', 1000, 0),
    company('GGG', 1000, 0),
  ],
};

describe('median', () => {
  it('calcula medianas ímpares e pares', () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it('ignora valores inválidos e devolve 0 para listas vazias', () => {
    expect(median([10, 'x', null, 20])).toBe(15);
    expect(median([])).toBe(0);
    expect(median(null)).toBe(0);
  });
});

describe('hhi', () => {
  it('devolve 10 000 para uma única empresa e 2 500 para quatro iguais', () => {
    expect(hhi([500])).toBe(10000);
    expect(hhi([100, 100, 100, 100])).toBe(2500);
  });

  it('ignora market caps inválidos e devolve 0 sem valores positivos', () => {
    expect(hhi([100, null, 'x', 0])).toBe(10000);
    expect(hhi([])).toBe(0);
    expect(hhi([0, -5, null])).toBe(0);
  });
});

describe('classificações', () => {
  it('classifica a concentração pelos limiares do HHI', () => {
    expect(classifyConcentration(2500)).toBe('Alta');
    expect(classifyConcentration(2499.9)).toBe('Moderada');
    expect(classifyConcentration(1500)).toBe('Moderada');
    expect(classifyConcentration(1499.9)).toBe('Baixa');
  });

  it('classifica o perfil pela cobertura de dividendos', () => {
    expect(classifyIncomeProfile(0.7)).toBe('Renda');
    expect(classifyIncomeProfile(0.6999)).toBe('Equilibrado');
    expect(classifyIncomeProfile(0.4)).toBe('Equilibrado');
    expect(classifyIncomeProfile(0.3999)).toBe('Crescimento');
  });
});

describe('formatação', () => {
  it('formata percentagens e HHI', () => {
    expect(formatShare(0.8)).toBe('80.0%');
    expect(formatShare(0.6667)).toBe('66.7%');
    expect(formatShare(undefined)).toBe('0.0%');
    expect(formatHhi(4600)).toMatch(/4[.,]600/);
    expect(formatHhi('x')).toBe('0');
  });
});

describe('buildSectorMetrics', () => {
  it('agrega tamanho, concentração, dividendos e subindústrias', () => {
    const metrics = buildSectorMetrics(SECTOR_A, 5000);

    expect(metrics.id).toBe('alpha');
    expect(metrics.companyCount).toBe(3);
    expect(metrics.totalMarketCap).toBe(1000);
    expect(metrics.marketCapShare).toBe(0.2);
    expect(metrics.medianMarketCap).toBe(300);
    expect(metrics.averageMarketCap).toBe(333);
    expect(metrics.hhi).toBe(4600);
    expect(metrics.concentration).toBe('Alta');
    expect(metrics.topCompany.symbol).toBe('AAA');
    expect(metrics.topCompany.weight).toBe(0.6);
    expect(metrics.top3Weight).toBe(1);
    expect(metrics.dividendPayers).toBe(2);
    expect(metrics.dividendCoverage).toBe(0.6667);
    expect(metrics.averageDividendYield).toBe(3);
    expect(metrics.incomeProfile).toBe('Equilibrado');
    expect(metrics.subIndustryCount).toBe(2);
    expect(metrics.topSubIndustries.map((s) => s.name)).toEqual(['Software', 'Hardware']);
  });

  it('tolera setores vazios', () => {
    const metrics = buildSectorMetrics({ id: 'vazio', companies: [] }, 0);
    expect(metrics.companyCount).toBe(0);
    expect(metrics.marketCapShare).toBe(0);
    expect(metrics.hhi).toBe(0);
    expect(metrics.topCompany).toBeNull();
    expect(metrics.incomeProfile).toBe('Crescimento');
  });
});

describe('buildSectorIntelligence', () => {
  it('ordena por market cap, atribui ranking e calcula o índice', () => {
    const data = buildSectorIntelligence([SECTOR_A, SECTOR_B]);

    expect(data.sectorCount).toBe(2);
    expect(data.totalCompanies).toBe(7);
    expect(data.totalMarketCap).toBe(5000);
    expect(data.dividendPayers).toBe(2);
    expect(data.dividendCoverage).toBe(0.2857);
    expect(data.indexHhi).toBe(1784);
    expect(data.generatedAt).toBe('2026-10-21');
    expect(data.sectors.map((s) => s.id)).toEqual(['beta', 'alpha']);
    expect(data.sectors.map((s) => s.rank)).toEqual([1, 2]);
    expect(data.sectors[0].marketCapShare).toBe(0.8);
  });

  it('destaca o maior, o mais concentrado, o mais diversificado e o maior yield', () => {
    const { highlights } = buildSectorIntelligence([SECTOR_A, SECTOR_B]);

    expect(highlights.largestSector.id).toBe('beta');
    expect(highlights.largestSector.share).toBe(0.8);
    expect(highlights.mostConcentrated.id).toBe('alpha');
    expect(highlights.mostDiversified.id).toBe('beta');
    expect(highlights.highestYield.id).toBe('alpha');
    expect(highlights.highestYield.averageDividendYield).toBe(3);
    expect(highlights.widestSector.id).toBe('beta');
  });

  it('devolve um relatório vazio sem setores', () => {
    const data = buildSectorIntelligence([]);
    expect(data.sectorCount).toBe(0);
    expect(data.sectors).toEqual([]);
    expect(data.generatedAt).toBeNull();
    expect(data.highlights.largestSector).toBeNull();
  });
});

describe('sortSectorMetrics', () => {
  const metrics = buildSectorIntelligence([SECTOR_A, SECTOR_B]).sectors;

  it('ordena por participação (desc) por defeito', () => {
    expect(sortSectorMetrics(metrics).map((s) => s.id)).toEqual(['beta', 'alpha']);
  });

  it('ordena por HHI e por nome', () => {
    expect(sortSectorMetrics(metrics, 'hhi-desc').map((s) => s.id)).toEqual(['alpha', 'beta']);
    expect(sortSectorMetrics(metrics, 'name-asc').map((s) => s.id)).toEqual(['alpha', 'beta']);
    expect(sortSectorMetrics(metrics, 'name-desc').map((s) => s.id)).toEqual(['beta', 'alpha']);
  });

  it('não altera a lista original', () => {
    const original = metrics.map((s) => s.id);
    sortSectorMetrics(metrics, 'name-asc');
    expect(metrics.map((s) => s.id)).toEqual(original);
  });
});

describe('renderSectorIntelligence', () => {
  const data = buildSectorIntelligence([SECTOR_A, SECTOR_B]);

  beforeEach(() => {
    document.body.innerHTML = '<div id="sector-intelligence-view"></div>';
    delete window.openCompanyDetails;
  });

  it('renderiza cabeçalho, estatísticas, destaques e uma linha por setor', () => {
    renderSectorIntelligence('sector-intelligence-view', data);
    const root = document.getElementById('sector-intelligence-view');

    expect(root.textContent).toContain('Inteligência Setorial GICS');
    expect(root.textContent).toContain('HHI do índice');
    expect(root.querySelectorAll('.si-stat')).toHaveLength(5);
    expect(root.querySelectorAll('.si-highlight')).toHaveLength(4);
    expect(root.querySelectorAll('.si-row')).toHaveLength(2);
    expect(root.querySelectorAll('.si-detail')).toHaveLength(2);
    expect(root.querySelectorAll('.si-badge--high').length).toBeGreaterThanOrEqual(2);
  });

  it('expande e recolhe os detalhes de um setor', () => {
    renderSectorIntelligence('sector-intelligence-view', data);
    const root = document.getElementById('sector-intelligence-view');
    const row = root.querySelector('.si-row');
    const button = row.querySelector('.si-sector-btn');
    const detail = row.nextElementSibling;

    expect(detail.hidden).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(detail.hidden).toBe(false);
    expect(detail.textContent).toContain('Top 5 empresas por market cap');

    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(detail.hidden).toBe(true);
  });

  it('reordena as linhas e mantém o setor expandido', () => {
    renderSectorIntelligence('sector-intelligence-view', data);
    const root = document.getElementById('sector-intelligence-view');

    const firstRow = root.querySelector('.si-row');
    const firstId = firstRow.dataset.sector;
    firstRow.querySelector('.si-sector-btn').click();

    const select = root.querySelector('#si-sort');
    select.value = 'name-asc';
    select.dispatchEvent(new Event('change'));

    const rows = [...root.querySelectorAll('.si-row')];
    expect(rows[0].querySelector('.si-sector-btn span:last-child').textContent).toBe('Alpha');

    const expandedRow = root.querySelector(`.si-row[data-sector="${firstId}"]`);
    expect(expandedRow.querySelector('.si-sector-btn').getAttribute('aria-expanded')).toBe('true');
    expect(expandedRow.nextElementSibling.hidden).toBe(false);
  });

  it('abre os detalhes da empresa através do modal global', () => {
    const openDetails = vi.fn();
    window.openCompanyDetails = openDetails;

    renderSectorIntelligence('sector-intelligence-view', data);
    const root = document.getElementById('sector-intelligence-view');
    const row = root.querySelector('.si-row');
    row.querySelector('.si-sector-btn').click();

    const companyButton = row.nextElementSibling.querySelector('.si-company');
    companyButton.click();

    expect(openDetails).toHaveBeenCalledWith({ symbol: 'DDD', name: 'DDD Corp' });
  });

  it('escapa HTML vindo dos dados', () => {
    const unsafe = {
      ...data,
      sectors: [{ ...data.sectors[0], name: '<script>alert(1)</script>' }],
    };

    renderSectorIntelligence('sector-intelligence-view', unsafe);
    const root = document.getElementById('sector-intelligence-view');

    expect(root.innerHTML).not.toContain('<script>alert(1)</script>');
    expect(root.textContent).toContain('<script>alert(1)</script>');
  });

  it('mostra estado vazio sem setores', () => {
    renderSectorIntelligence('sector-intelligence-view', { sectors: [] });
    const root = document.getElementById('sector-intelligence-view');
    expect(root.textContent).toContain('Sem dados setoriais');
  });
});
