import { render, screen } from '@testing-library/react';

import { useUI } from '@machado-repo/ui';

import ReceiptInfoExtractedData from '../components/info/extracted-data/ReceiptInfoExtractedData';
import type { TReceiptConfirm } from '../types';

jest.mock('@machado-repo/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useUI: jest.fn(() => ({ locale: 'en-US' })),
}));

describe('ReceiptInfoExtractedData', () => {
  it('formats amounts, dates and labels and omits the internal identifier', () => {
    const item: TReceiptConfirm = {
      id: 'receipt-1',
      fine: 1.25,
      payer: 'Payer',
      barcode: '12345',
      due_date: new Date('2026-10-01T00:00:00.000Z'),
      category: 'Utilities',
      discount: 0.5,
      interest: 0.25,
      description: 'Electricity bill',
      beneficiary: 'Power Co.',
      paid_amount: 75.5,
      payment_date: new Date('2026-10-02T00:00:00.000Z'),
      total_charges: 77.5,
      authentication: 'auth-code',
      transaction_id: 'transaction-1',
      effective_payer: 'Effective payer',
      document_amount: 75.5,
      source_institution: 'Bank A',
      destination_institution: 'Bank B',
    };

    render(<ReceiptInfoExtractedData item={item} />);

    expect(screen.queryByText('receipt-1')).toBeNull();
    expect(screen.getByText('finance.beneficiary.name.label')).toBeTruthy();
    expect(screen.getByText('finance.payment.date.label')).toBeTruthy();
    expect(screen.getByText('finance.payment.source_institution.label')).toBeTruthy();
    expect(screen.getByText('finance.payment.destination_institution.label')).toBeTruthy();
    expect(screen.getByText('finance.category.name.label')).toBeTruthy();
    expect(screen.getByText('form.label.description')).toBeTruthy();
    expect(screen.getByText('$1.25')).toBeTruthy();
    expect(screen.getByText('$75.50')).toBeTruthy();
    expect(screen.getByText('10/1/2026')).toBeTruthy();
    expect(screen.getByText('Electricity bill')).toBeTruthy();
  });

  it('uses placeholders for empty values and formats string dates', () => {
    render(<ReceiptInfoExtractedData item={{
      id: 'receipt-2',
      category: '',
      beneficiary: '',
      paid_amount: 0,
      due_date: '2026-10-01' as unknown as Date,
      source_institution: '',
    }} />);

    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    expect(screen.getByText('10/1/2026')).toBeTruthy();
    expect(useUI).toHaveBeenCalled();
  });
});
