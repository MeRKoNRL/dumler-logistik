import { describe, it, expect } from 'vitest';

describe('Daily Plan Flow', () => {
  it('should simulate creating and copying plan', () => {
    const plan = [
      { driver: 'X', client: 'C1', cargo: '1т', vehicle: 'V1', route: 'R1', status: 'новый' }
    ];

    const copy = plan.map(p => ({ driver: p.driver, client: p.client }));
    expect(copy[0].driver).toBe('X');
    expect(copy[0].client).toBe('C1');
    expect(copy[0].vehicle).toBeUndefined();
  });
});
