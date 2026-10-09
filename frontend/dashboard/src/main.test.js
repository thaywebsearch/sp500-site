import { describe, expect, it } from 'vitest';
import {
  buildRationale,
  dateToSeed,
  sectorScore,
  technicalScore,
  volatilityScore,
} from './main.js';

describe('dateToSeed', () => {
  it('é determinístico e devolve inteiro não negativo', () => {
    const a = dateToSeed('2026-10-09');
    const b = dateToSeed('2026-10-09');
    expect(a).toBe(b);
    expect(Number.isInteger(a)).toBe(true);
    expect(a).toBeGreaterThanOrEqual(0);
  });

  it('difere entre datas distintas', () => {
    expect(dateToSeed('2026-10-09')).not.toBe(dateToSeed('2026-01-01'));
  });
});

describe('technicalScore', () => {
  it('devolve 50 para empresa sem atributos relevantes', () => {
    expect(technicalScore({})).toBe(50);
  });

  it('premia dividendo, capitalização e subindústria', () => {
    expect(technicalScore({ dividendYield: 5 })).toBe(65);
    expect(technicalScore({ marketCap: 6e10 })).toBe(55);
    expect(technicalScore({ subIndustry: 'Cloud Software' })).toBe(62);
  });

  it('limita a pontuação a 90', () => {
    const company = {
      dividendYield: 5,
      marketCap: 6e11,
      subIndustry: 'semiconductors',
      name: 'Foo Inc.',
    };
    expect(technicalScore(company)).toBe(90);
  });
});

describe('sectorScore', () => {
  it('devolve o peso do setor conhecido', () => {
    expect(sectorScore('information-technology')).toBe(15);
    expect(sectorScore('utilities')).toBe(-2);
  });

  it('devolve 0 para setor desconhecido', () => {
    expect(sectorScore('inexistente')).toBe(0);
  });
});

describe('volatilityScore', () => {
  it('diminui com a capitalização', () => {
    expect(volatilityScore({ marketCap: 3e11 })).toBe(8);
    expect(volatilityScore({ marketCap: 1e11 })).toBe(12);
    expect(volatilityScore({ marketCap: 2e10 })).toBe(15);
    expect(volatilityScore({ marketCap: 5e9 })).toBe(18);
  });
});

describe('buildRationale', () => {
  it('junta os motivos aplicáveis', () => {
    const company = { sectorName: 'Tech', dividendYield: 3, marketCap: 2e11 };
    const out = buildRationale(company, 61, 11, 15, 1);
    expect(out).toContain('Fundamentos técnicos sólidos');
    expect(out).toContain('Setor em momento favorável (Tech)');
    expect(out).toContain('watchlist');
    expect(out).toContain('3.0%');
    expect(out).toContain('Grande capitalização');
  });

  it('devolve motivo por defeito quando nada se aplica', () => {
    expect(buildRationale({}, 0, 0, 0, 0)).toBe('Equilíbrio entre risco e retorno');
  });
});
