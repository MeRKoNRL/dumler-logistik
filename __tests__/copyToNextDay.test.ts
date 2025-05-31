import { describe, it, expect } from 'vitest';

function copyToNextDay(entries: any[], fieldsToCopy: string[]) {
  return entries.map(e => {
    const result: any = {};
    fieldsToCopy.forEach(field => result[field] = e[field]);
    return result;
  });
}

describe('copyToNextDay', () => {
  it('copies selected fields only', () => {
    const data = [
      { driver: 'A', vehicle: 'V1', client: 'C1', cargo: 'X' },
      { driver: 'B', vehicle: 'V2', client: 'C2', cargo: 'Y' },
    ];
    const copied = copyToNextDay(data, ['driver', 'client']);
    expect(copied).toEqual([
      { driver: 'A', client: 'C1' },
      { driver: 'B', client: 'C2' },
    ]);
  });
});
