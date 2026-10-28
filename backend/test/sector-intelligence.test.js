import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSectorIntelligence,
  buildSectorMetrics,
  classificarConcentracao,
  classificarPerfil,
  hhi,
  mediana,
} from '../sector-intelligence.mjs';

const empresa = (symbol, marketCap, dividendYield, subIndustry = 'Software') => ({
  symbol,
  name: `${symbol} Corp`,
  marketCap,
  dividendYield,
  subIndustry,
});

const SETOR_A = {
  id: 'alpha',
  name: 'Alpha',
  generatedAt: '2026-10-01',
  companies: [
    empresa('AAA', 600, 2, 'Software'),
    empresa('BBB', 300, 0, 'Software'),
    empresa('CCC', 100, 4, 'Hardware'),
  ],
};

const SETOR_B = {
  id: 'beta',
  name: 'Beta',
  generatedAt: '2026-10-21',
  companies: [
    empresa('DDD', 1000, 0),
    empresa('EEE', 1000, 0),
    empresa('FFF', 1000, 0),
    empresa('GGG', 1000, 0),
  ],
};

describe('mediana', () => {
  it('calcula medianas ímpares e pares', () => {
    assert.equal(mediana([3, 1, 2]), 2);
    assert.equal(mediana([4, 1, 3, 2]), 2.5);
  });

  it('ignora valores inválidos e devolve 0 para listas vazias', () => {
    assert.equal(mediana([10, 'x', null, 20]), 15);
    assert.equal(mediana([]), 0);
    assert.equal(mediana(null), 0);
  });
});

describe('hhi', () => {
  it('devolve 10 000 para uma única empresa', () => {
    assert.equal(hhi([500]), 10000);
  });

  it('devolve 2 500 para quatro empresas iguais', () => {
    assert.equal(hhi([100, 100, 100, 100]), 2500);
  });

  it('ignora market caps inválidos e devolve 0 sem valores positivos', () => {
    assert.equal(hhi([100, null, 'x', 0]), 10000);
    assert.equal(hhi([]), 0);
    assert.equal(hhi([0, -5, null]), 0);
  });
});

describe('classificações', () => {
  it('classifica a concentração pelos limiares do HHI', () => {
    assert.equal(classificarConcentracao(2500), 'Alta');
    assert.equal(classificarConcentracao(2499.9), 'Moderada');
    assert.equal(classificarConcentracao(1500), 'Moderada');
    assert.equal(classificarConcentracao(1499.9), 'Baixa');
  });

  it('classifica o perfil pela cobertura de dividendos', () => {
    assert.equal(classificarPerfil(0.7), 'Renda');
    assert.equal(classificarPerfil(0.6999), 'Equilibrado');
    assert.equal(classificarPerfil(0.4), 'Equilibrado');
    assert.equal(classificarPerfil(0.3999), 'Crescimento');
  });
});

describe('buildSectorMetrics', () => {
  it('agrega tamanho, concentração, dividendos e subindústrias', () => {
    const metricas = buildSectorMetrics(SETOR_A, 5000);

    assert.equal(metricas.id, 'alpha');
    assert.equal(metricas.name, 'Alpha');
    assert.equal(metricas.companyCount, 3);
    assert.equal(metricas.totalMarketCap, 1000);
    assert.equal(metricas.marketCapShare, 0.2);
    assert.equal(metricas.medianMarketCap, 300);
    assert.equal(metricas.averageMarketCap, 333);
    assert.equal(metricas.hhi, 4600);
    assert.equal(metricas.concentration, 'Alta');
    assert.equal(metricas.topCompany.symbol, 'AAA');
    assert.equal(metricas.topCompany.weight, 0.6);
    assert.equal(metricas.top3Weight, 1);
    assert.equal(metricas.dividendPayers, 2);
    assert.equal(metricas.dividendCoverage, 0.6667);
    assert.equal(metricas.averageDividendYield, 3);
    assert.equal(metricas.incomeProfile, 'Equilibrado');
    assert.equal(metricas.subIndustryCount, 2);
    assert.deepEqual(
      metricas.topSubIndustries.map((s) => s.name),
      ['Software', 'Hardware']
    );
  });

  it('tolera setores vazios ou sem market cap', () => {
    const metricas = buildSectorMetrics({ id: 'vazio', companies: [] }, 0);
    assert.equal(metricas.companyCount, 0);
    assert.equal(metricas.totalMarketCap, 0);
    assert.equal(metricas.marketCapShare, 0);
    assert.equal(metricas.hhi, 0);
    assert.equal(metricas.topCompany, null);
    assert.equal(metricas.averageDividendYield, 0);
    assert.equal(metricas.incomeProfile, 'Crescimento');
  });
});

describe('buildSectorIntelligence', () => {
  it('ordena por market cap, atribui ranking e calcula o índice', () => {
    const dados = buildSectorIntelligence([SETOR_A, SETOR_B]);

    assert.equal(dados.sectorCount, 2);
    assert.equal(dados.totalCompanies, 7);
    assert.equal(dados.totalMarketCap, 5000);
    assert.equal(dados.dividendPayers, 2);
    assert.equal(dados.dividendCoverage, 0.2857);
    assert.equal(dados.indexHhi, 1784);
    assert.equal(dados.generatedAt, '2026-10-21');

    assert.deepEqual(
      dados.sectors.map((s) => s.id),
      ['beta', 'alpha']
    );
    assert.deepEqual(
      dados.sectors.map((s) => s.rank),
      [1, 2]
    );
    assert.equal(dados.sectors[0].marketCapShare, 0.8);
    assert.equal(dados.sectors[1].marketCapShare, 0.2);
  });

  it('destaca o maior, o mais concentrado, o mais diversificado e o maior yield', () => {
    const { highlights } = buildSectorIntelligence([SETOR_A, SETOR_B]);

    assert.equal(highlights.largestSector.id, 'beta');
    assert.equal(highlights.largestSector.share, 0.8);
    assert.equal(highlights.mostConcentrated.id, 'alpha');
    assert.equal(highlights.mostConcentrated.hhi, 4600);
    assert.equal(highlights.mostDiversified.id, 'beta');
    assert.equal(highlights.highestYield.id, 'alpha');
    assert.equal(highlights.highestYield.averageDividendYield, 3);
    assert.equal(highlights.widestSector.id, 'beta');
    assert.equal(highlights.widestSector.companyCount, 4);
  });

  it('devolve um relatório vazio sem setores', () => {
    const dados = buildSectorIntelligence([]);

    assert.equal(dados.sectorCount, 0);
    assert.equal(dados.totalCompanies, 0);
    assert.equal(dados.totalMarketCap, 0);
    assert.equal(dados.indexHhi, 0);
    assert.equal(dados.generatedAt, null);
    assert.deepEqual(dados.sectors, []);
    assert.equal(dados.highlights.largestSector, null);
    assert.equal(dados.highlights.highestYield, null);
  });
});
