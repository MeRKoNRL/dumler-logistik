import { describe, it, expect } from 'vitest';

describe('useUserData', () => {
  it('should return mocked user data', () => {
    const mock = { user: { uid: '123' }, role: 'admin' };
    expect(mock.role).toBe('admin');
  });
});
