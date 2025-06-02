import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([]) })
) as jest.Mock;

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('📊 Дашборд активности')).toBeInTheDocument();
  });
});