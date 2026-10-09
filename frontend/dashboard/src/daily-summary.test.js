import { describe, expect, it } from 'vitest';
import {
  formatPct,
  formatReferenceDate,
  renderRankList,
  renderDailySummary,
} from './daily-summary.js';

describe('formatPct', () => {
  it('prefixa + para valores positivos', () => {
    expect(formatPct(2.5)).toBe('+2.50%');
  });

  it('mantém - para negativos e zero sem sinal', () => {
    expect(formatPct(-1.2)).toBe('-1.20%');
    expect(formatPct(0)).toBe('0.00%');
  });

  it('trata valores inválidos como 0', () => {
    expect(formatPct(null)).toBe('0.00%');
    expect(formatPct('abc')).toBe('0.00%');
  });
});

describe('formatReferenceDate', () => {
  it('formata data ISO (sem hora) para pt-BR', () => {
    expect(formatReferenceDate('2026-10-09')).toBe('09/10/2026');
  });

  it('devolve vazio para ausente/inválida', () => {
    expect(formatReferenceDate('')).toBe('');
    expect(formatReferenceDate('data-invalida')).toBe('');
  });
});

describe('renderRankList', () => {
  it('renderiza título e linhas com classe de sinal', () => {
    const html = renderRankList('🚀 Altas', [
      { symbol: 'AAPL', name: 'Apple', changePct: 2.5 },
      { symbol: 'XOM', name: 'Exxon', changePct: -1.2 },
    ]);
    expect(html).toContain('🚀 Altas');
    expect(html).toContain('AAPL');
    expect(html).toContain('mini-change positive');
    expect(html).toContain('mini-change negative');
  });

  it('não rebenta com lista ausente', () => {
    expect(renderRankList('Vazio', [])).toContain('Vazio');
  });
});

describe('renderDailySummary', () => {
  const data = {
    stats: { gainers: 5, losers: 3, neutral: 2, total: 10 },
    marketMood: 'bullish',
    referenceDate: '2026-10-09',
    topGainers: [{ symbol: 'AAPL', name: 'Apple', changePct: 2.5 }],
    topLosers: [{ symbol: 'XOM', name: 'Exxon', changePct: -1.2 }],
    sectorPerformance: [{ name: 'Energy', avgChangePct: -0.5 }],
  };

  it('renderiza estatísticas, humor e data de referência', () => {
    const container = { innerHTML: '' };
    renderDailySummary(container, data);
    expect(container.innerHTML).toContain('Otimista');
    expect(container.innerHTML).toContain('Referência: 09/10/2026');
    expect(container.innerHTML).toContain('AAPL');
    expect(container.innerHTML).toContain('+2.50%');
    expect(container.innerHTML).toContain('XOM');
    expect(container.innerHTML).toContain('-1.20%');
    expect(container.innerHTML).toContain('Energy');
  });

  it('usa fallback de humor desconhecido e não rebenta sem dados', () => {
    const container = { innerHTML: '' };
    renderDailySummary(container, {});
    expect(container.innerHTML).toContain('📊 Resumo do Dia');
    expect(container.innerHTML).toContain('—');
  });
});
