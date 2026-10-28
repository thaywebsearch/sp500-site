// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Os scripts npm correm a partir desta pasta (frontend/dashboard)
const htmlPath = resolve(process.cwd(), 'index.html');
const doc = new DOMParser().parseFromString(readFileSync(htmlPath, 'utf8'), 'text/html');

const GROUPS = ['Geral', 'Mercado', 'Dividendos', 'Índices'];

const ALL_TABS = [
  'dashboard',
  'daily-curiosity',
  'stock-of-day',
  'treemap',
  'heatmap',
  'bubble',
  'sector-intelligence',
  'dividends',
  'dividend-kings',
  'dividend-aristocrats',
  'dow-jones',
  'nasdaq-100',
];

describe('nav agrupado por categorias (index.html)', () => {
  it('contém os 4 grupos com rótulos visíveis', () => {
    const groups = [...doc.querySelectorAll('.nav-group')];
    expect(groups).toHaveLength(4);
    expect(groups.map((g) => g.querySelector('.nav-group-label')?.textContent?.trim())).toEqual(
      GROUPS
    );
  });

  it('cada grupo tem role, aria-label e a contagem esperada de abas', () => {
    const groups = [...doc.querySelectorAll('.nav-group')];
    expect(groups.map((g) => g.querySelectorAll('.nav-group-tabs .nav-tab').length)).toEqual([
      3, 4, 3, 2,
    ]);
    groups.forEach((group) => {
      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('todas as abas ficam dentro de um grupo, sem órfãs', () => {
    const tabs = [...doc.querySelectorAll('.nav-tab')];
    expect(tabs).toHaveLength(ALL_TABS.length);
    tabs.forEach((tab) => {
      expect(tab.closest('.nav-group-tabs')).toBeTruthy();
      expect(tab.closest('.nav-group')).toBeTruthy();
      expect(tab.textContent.trim()).not.toBe('');
      expect(tab.getAttribute('data-tab')).toBeTruthy();
    });
  });

  it('mantém todos os data-tab usados pelo main.js', () => {
    const found = [...doc.querySelectorAll('.nav-tab')].map((t) => t.getAttribute('data-tab'));
    expect([...found].sort()).toEqual([...ALL_TABS].sort());
  });

  it('só o dashboard vem activo e está no grupo Geral', () => {
    const active = [...doc.querySelectorAll('.nav-tab.active')];
    expect(active).toHaveLength(1);
    expect(active[0].getAttribute('data-tab')).toBe('dashboard');
    expect(active[0].closest('.nav-group').querySelector('.nav-group-label').textContent).toBe(
      'Geral'
    );
  });
});
