import { render, screen } from '@testing-library/react';
import { NotificationBell } from '@/components/ui/NotificationBell';

jest.mock('@/lib/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'testUser' } })
}));

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([]) })
) as jest.Mock;

describe('NotificationBell', () => {
  it('renders bell icon', async () => {
    render(<NotificationBell />);
    expect(screen.getByLabelText('Уведомления')).toBeInTheDocument();
  });
});