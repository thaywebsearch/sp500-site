import { describe, expect, it, vi } from 'vitest';
import { API_BASE_URL, SECTORS } from './config.js';

describe('config', () => {
  it('aponta para a API local em ambiente de teste (localhost)', () => {
    expect(API_BASE_URL).toBe('http://localhost:5001');
  });

  it('lista os 11 setores com ids únicos', () => {
    expect(SECTORS).toHaveLength(11);
    expect(new Set(SECTORS.map((s) => s.id)).size).toBe(11);
  });

  it('usa a URL de produção do Railway fora de localhost', async () => {
    const original = window.location;
    window.location = { hostname: 'sp500.example.com' };
    vi.resetModules();
    const mod = await import('./config.js');
    expect(mod.API_BASE_URL).toBe('https://sp500-site-production.up.railway.app');
    window.location = original;
    vi.resetModules();
  });
});
