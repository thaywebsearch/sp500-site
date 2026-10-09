import { describe, expect, it } from 'vitest';
import { detailItem } from './company-details.js';

describe('detailItem', () => {
  it('constrói o markup com rótulo e valor', () => {
    const html = detailItem('Setor', 'Energy');
    expect(html).toContain('company-detail');
    expect(html).toContain('Setor');
    expect(html).toContain('Energy');
  });
});
