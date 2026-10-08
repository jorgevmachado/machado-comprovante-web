import { render, screen } from '@testing-library/react';

import PaymentsInfo from '../components/info/PaymentsInfo';
import PaymentsList from '../components/list';

jest.mock('@machado-repo/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('../components/list', () => jest.fn(() => null));

describe('PaymentsInfo', () => {
  it('renders recent payments with the default title and loading state', () => {
    render(<PaymentsInfo payments={[]} isLoading />);

    expect(screen.getByText('finance.payment.recent.title')).toBeTruthy();
    expect(jest.mocked(PaymentsList)).toHaveBeenCalledWith(
      expect.objectContaining({ payments: [], isLoading: true }),
      undefined,
    );
  });

  it('uses a custom title and forwards payment data', () => {
    const payments = [{ id: 'payment-1' }] as never;
    render(<PaymentsInfo title="Latest" payments={payments} isLoading={false} />);

    expect(screen.getByText('Latest')).toBeTruthy();
    expect(jest.mocked(PaymentsList)).toHaveBeenCalledWith(
      expect.objectContaining({ payments, isLoading: false }),
      undefined,
    );
  });
});
