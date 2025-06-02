import { render, screen } from '@testing-library/react';
import { ReminderList } from '@/components/ui/ReminderList';

jest.mock('@/lib/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'testUser' } })
}));

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([]) })
) as jest.Mock;

describe('ReminderList', () => {
  it('renders reminder list title', async () => {
    render(<ReminderList />);
    expect(screen.getByText('🔔 Напоминания')).toBeInTheDocument();
  });
});