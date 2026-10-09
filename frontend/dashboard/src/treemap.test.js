import { describe, expect, it } from 'vitest';
import { getColor } from './treemap.js';

describe('getColor', () => {
  it('mapeia faixas de percentagem de market cap', () => {
    expect(getColor(80, 100)).toBe('#ff5252');
    expect(getColor(60, 100)).toBe('#ff9800');
    expect(getColor(40, 100)).toBe('#ffeb3b');
    expect(getColor(20, 100)).toBe('#8bc34a');
    expect(getColor(19, 100)).toBe('#4caf50');
  });
});
