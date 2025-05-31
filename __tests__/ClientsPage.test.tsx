
import { render, screen } from '@testing-library/react';
import ClientsPage from '@/app/clients/page';

jest.mock('@/lib/useCollection', () => ({
  useCollection: () => ({ data: [{ id: '1', name: 'Test', city: 'City', remaining: 5 }], loading: false })
}));

test('renders client table', () => {
  render(<ClientsPage />);
  expect(screen.getByPlaceholderText(/Фильтр по имени/)).toBeInTheDocument();
  expect(screen.getByDisplayValue(/Test/)).toBeInTheDocument();
});
