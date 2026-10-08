import { render, screen } from '@testing-library/react';

import { Money, Result } from '@machado-repo/shared';
import { useUI } from '@machado-repo/ui';

import PaymentsCount from '../payment/components/count/PaymentsCount';
import PaymentsMax from '../payment/components/max/PaymentsMax';
import PaymentsTotal from '../payment/components/total/PaymentsTotal';
import TotalReceipts from '../receipt/components/total-receipts/TotalReceipts';
import { EReceiptProcessingStatus } from '../receipt/types';

jest.mock('@machado-repo/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useUI: jest.fn(() => ({ locale: 'en-US' })),
}));

describe('finance summary components', () => {
  it('renders payment count with the default and custom titles', () => {
    const { rerender } = render(<PaymentsCount count={4} />);
    expect(screen.getByText('finance.payment.count.title')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();

    rerender(<PaymentsCount count={0} title="Custom count" />);
    expect(screen.getByText('Custom count')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('formats total and maximum payment values for the active locale', () => {
    const { rerender } = render(<PaymentsTotal total={1234.5} />);
    expect(screen.getByText('finance.payment.total.title')).toBeTruthy();
    expect(screen.getByText('$1,234.50')).toBeTruthy();

    rerender(<PaymentsTotal total={Number.NaN} title="Custom total" />);
    expect(screen.getByText('Custom total')).toBeTruthy();
    expect(screen.getByText('$NaN')).toBeTruthy();

    rerender(<PaymentsMax maxValue={99.99} />);
    expect(screen.getByText('finance.payment.max.title')).toBeTruthy();
    expect(screen.getByText('$99.99')).toBeTruthy();

    rerender(<PaymentsMax maxValue={Number.NaN} title="Custom max" />);
    expect(screen.getByText('Custom max')).toBeTruthy();
    expect(screen.getByText('$NaN')).toBeTruthy();
    expect(useUI).toHaveBeenCalled();
  });

  it('falls back to a zero value when money formatting fails', () => {
    const zeroValue = Money.create(0);
    const failedFormat = jest.spyOn(Money, 'tryCreate');
    failedFormat
      .mockReturnValueOnce(Result.fail('Could not format total'))
      .mockReturnValueOnce(Result.ok(zeroValue))
      .mockReturnValueOnce(Result.fail('Could not format maximum'))
      .mockReturnValueOnce(Result.ok(zeroValue));

    const { rerender } = render(<PaymentsTotal total={123} />);
    expect(screen.getByText('$0.00')).toBeTruthy();
    rerender(<PaymentsMax maxValue={123} />);
    expect(screen.getByText('$0.00')).toBeTruthy();
    failedFormat.mockRestore();
  });

  it('counts receipts in each processing state', () => {
    render(<TotalReceipts receiptsList={{
      [EReceiptProcessingStatus.RECEIVED]: [{} as never],
      [EReceiptProcessingStatus.PROCESSED]: [{}, {}] as never,
      [EReceiptProcessingStatus.PROCESSING]: [] as never,
      [EReceiptProcessingStatus.FAILED]: [{} as never, {} as never, {} as never],
    }} />);

    expect(document.getElementById(EReceiptProcessingStatus.RECEIVED)?.textContent).toContain('1');
    expect(document.getElementById(EReceiptProcessingStatus.PROCESSED)?.textContent).toContain('2');
    expect(document.getElementById(EReceiptProcessingStatus.PROCESSING)?.textContent).toContain('0');
    expect(document.getElementById(EReceiptProcessingStatus.FAILED)?.textContent).toContain('3');
  });

  it('shows zero counters if receipt groups are not available', () => {
    render(<TotalReceipts receiptsList={undefined as never} />);

    expect(document.getElementById(EReceiptProcessingStatus.RECEIVED)?.textContent).toContain('0');
    expect(document.getElementById(EReceiptProcessingStatus.PROCESSED)?.textContent).toContain('0');
  });
});
