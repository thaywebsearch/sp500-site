import { describe, expect, it } from 'vitest';
import { API_BASE_URL, SECTORS } from './config.js';

describe('config', () => {
  it('aponta para a API local em ambiente de teste (localhost)', () => {
    expect(API_BASE_URL).toBe('http://localhost:5001');
  });

  it('lista os 11 setores com ids únicos', () => {
    expect(SECTORS).toHaveLength(11);
    expect(new Set(SECTORS.map((s) => s.id)).size).toBe(11);
  });
});
