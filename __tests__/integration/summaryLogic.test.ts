import { describe, it, expect } from 'vitest';

describe('Summary Filter Logic', () => {
  it('filters by date range', () => {
    const all = [
      { date: '2025-05-01' }, { date: '2025-05-02' }, { date: '2025-05-05' }
    ];
    const from = '2025-05-02';
    const to = '2025-05-05';
    const filtered = all.filter(p => p.date >= from && p.date <= to);
    expect(filtered.length).toBe(2);
  });
});
