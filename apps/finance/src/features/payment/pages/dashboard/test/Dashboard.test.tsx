import { fireEvent, render, screen } from '@testing-library/react';
import { Filters, useUser } from '@machado-repo/ui';

import Dashboard from '../Dashboard';
import usePayments from '../../../hooks/usePayments';
import { useAppNavigation } from '@/src/app-shell/navigation';

jest.mock('@machado-repo/ui', () => ({
  Button: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  ),
  Filters: jest.fn(({ onApply }: { onApply: (filters: Record<string, string>) => void }) => (
    <button onClick={() => onApply({
      start_date: '2026-09-01',
      end_date: '2026-10-01',
    })}>Apply filters</button>
  )),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useUser: jest.fn(() => ({ user: { id: 'user-1', name: 'Avery' } })),
}));

jest.mock('../../../hooks/usePayments', () => jest.fn());
jest.mock('@/src/app-shell/navigation', () => ({
  useAppNavigation: jest.fn(),
}));
jest.mock('../components', () => ({
  DashboardBeneficiaries: jest.fn(() => <div>Beneficiaries chart</div>),
  DashboardCategoriesChart: jest.fn(() => <div>Categories chart</div>),
  DashboardMonthlyChart: jest.fn(() => <div>Monthly chart</div>),
  DashboardPayers: jest.fn(() => <div>Payers chart</div>),
  DashboardSummary: jest.fn(() => <div>Dashboard summary</div>),
}));
jest.mock('../components/institutions-chart', () => jest.fn(() => <div>Institutions chart</div>));

const getDashboard = jest.fn();
const defaultStartEndDates = {
  start_date: new Date('2026-09-01T00:00:00.000Z'),
  end_date: new Date('2026-10-01T00:00:00.000Z'),
};

function paymentsResult(status: 'loading' | 'error' | 'empty' | 'success') {
  return {
    dashboardStatus: status,
    getDashboard,
    defaultStartEndDates,
    dashboard: status === 'success'
      ? {
        summary: { total: 10, count: 1, average: 10, highest: 10 },
        monthly: [],
        categories: [],
        payers: [],
        beneficiaries: [],
        institutions: [],
        period: { start_date: defaultStartEndDates.start_date, end_date: defaultStartEndDates.end_date },
      }
      : undefined,
  };
}

describe('Dashboard', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.mocked(usePayments).mockReturnValue(paymentsResult('loading') as never);
    jest.mocked(useAppNavigation).mockReturnValue({ push } as never);
  });

  afterEach(() => jest.clearAllMocks());

  it('loads the dashboard, shows loading state and applies filters', () => {
    const { rerender } = render(<Dashboard />);

    expect(getDashboard).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(jest.mocked(useUser)).toHaveBeenCalled();
    expect(jest.mocked(Filters).mock.calls[0]?.[0].filters).toEqual([
      expect.objectContaining({ name: 'start_date', value: '2026-09-01' }),
      expect.objectContaining({ name: 'end_date', value: '2026-10-01' }),
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(getDashboard).toHaveBeenLastCalledWith({
      start_date: '2026-09-01',
      end_date: '2026-10-01',
    });
    rerender(<Dashboard />);
  });

  it('renders retry controls for errors and triggers a new request', () => {
    jest.mocked(usePayments).mockReturnValue(paymentsResult('error') as never);
    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'finance.payment.dashboard.retry' }));
    expect(getDashboard).toHaveBeenLastCalledWith(undefined);
  });

  it('renders an empty state without charts when no payments exist', () => {
    jest.mocked(usePayments).mockReturnValue(paymentsResult('empty') as never);
    render(<Dashboard />);

    expect(screen.getByText('finance.payment.dashboard.no_data')).toBeTruthy();
    expect(screen.queryByText('Dashboard summary')).toBeNull();
  });

  it('renders all dashboard visualizations and links to receipts', () => {
    jest.mocked(usePayments).mockReturnValue(paymentsResult('success') as never);
    render(<Dashboard />);

    expect(screen.getByText('Dashboard summary')).toBeTruthy();
    expect(screen.getByText('Monthly chart')).toBeTruthy();
    expect(screen.getByText('Categories chart')).toBeTruthy();
    expect(screen.getByText('Payers chart')).toBeTruthy();
    expect(screen.getByText('Beneficiaries chart')).toBeTruthy();
    expect(screen.getByText('Institutions chart')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'finance.receipt.subtitle' }));
    expect(push).toHaveBeenCalledWith('/receipt');
  });
});
