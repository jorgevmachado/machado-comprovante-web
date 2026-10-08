import { render } from '@testing-library/react';
import { Table, useUI, type TableProps } from '@machado-repo/ui';

import ReceiptInfoList from '../components/info/list/ReceiptInfoList';
import { Receipt } from '../domain/Receipt';
import {
  EReceiptFieldStatus,
  EReceiptProcessingStatus,
} from '../types';
import type { TReceiptConfirm, TReceiptData } from '../types';

jest.mock('@machado-repo/ui', () => ({
  Table: jest.fn(() => null),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useUI: jest.fn(() => ({ locale: 'en-US' })),
}));

const field = <T,>(value?: T) => ({
  value,
  status: value === undefined ? EReceiptFieldStatus.NOT_FOUND : EReceiptFieldStatus.FOUND,
});

const extractedData: TReceiptData = {
  fine: field(1.25),
  payer: field('Payer'),
  barcode: field('12345'),
  due_date: field(new Date('2026-10-01T00:00:00.000Z')),
  discount: field(0.5),
  category: field('Utilities'),
  interest: field(0.25),
  description: field('Electricity'),
  paid_amount: field(75.5),
  beneficiary: field('Power Co.'),
  payment_date: field(new Date('2026-10-02T00:00:00.000Z')),
  total_charges: field(77.5),
  authentication: field('auth-code'),
  transaction_id: field('transaction-1'),
  effective_payer: field('Effective payer'),
  document_amount: field(75.5),
  source_institution: field('Bank A'),
  destination_institution: field('Bank B'),
};

const receipt = Receipt.create({
  id: 'receipt-1',
  file_name: 'receipt.pdf',
  file_type: 'application/pdf',
  file_size: '1024',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
  extracted_data: extractedData,
  processing_status: EReceiptProcessingStatus.RECEIVED,
});

function tableProps() {
  const props = jest.mocked(Table).mock.calls.at(-1)?.[0] as
    | TableProps<TReceiptConfirm & { file_name: string }>
    | undefined;
  if (!props) {
    throw new Error('Expected the receipt table to be rendered.');
  }
  return props;
}

describe('ReceiptInfoList', () => {
  const onEdit = jest.fn();
  const onShow = jest.fn();
  const onConfirm = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('maps extracted data into table rows and formats configured columns', () => {
    render(
      <ReceiptInfoList
        type={EReceiptProcessingStatus.RECEIVED}
        receipts={[receipt]}
        className="receipt-list"
        onEdit={onEdit}
        onShow={onShow}
        onConfirm={onConfirm}
      />,
    );
    const props = tableProps();

    expect(props.items).toEqual([expect.objectContaining({
      id: 'receipt-1',
      file_name: 'receipt.pdf',
      payer: 'Payer',
      category: 'Utilities',
      beneficiary: 'Power Co.',
      paid_amount: 75.5,
    })]);
    const row = props.items[0];
    if (!row) {
      throw new Error('Expected one receipt row.');
    }
    const paymentDateHeader = props.headers.find((header) => header?.value === 'payment_date');
    const paidAmountHeader = props.headers.find((header) => header?.value === 'paid_amount');
    if (!paymentDateHeader || !paidAmountHeader) {
      throw new Error('Expected date and amount table headers.');
    }
    expect(paymentDateHeader.format?.(
      new Date('2026-10-02T00:00:00.000Z'),
      row,
    )).toBeTruthy();
    expect(paymentDateHeader.format?.(undefined, row))
      .toBe('');
    expect(paidAmountHeader.format?.(75.5, row))
      .toBe('$75.50');
    expect(props.actions?.icons).toHaveLength(3);

    props.actions?.icons?.[0]?.onClick?.(row);
    props.actions?.icons?.[1]?.onClick?.(row);
    props.actions?.icons?.[2]?.onClick?.(row);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({
      payer: 'Payer',
      category: 'Utilities',
      beneficiary: 'Power Co.',
    }));
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(useUI).toHaveBeenCalled();
  });

  it('normalizes absent extracted fields and omits actions when no handlers exist', () => {
    const receiptWithoutFields = Receipt.create({
      ...receipt,
      id: 'receipt-2',
      extracted_data: {
        fine: field(),
        payer: field(),
        barcode: field(),
        due_date: field(),
        discount: field(),
        category: field(),
        interest: field(),
        description: field(),
        paid_amount: field(),
        beneficiary: field(),
        payment_date: field(),
        total_charges: field(),
        authentication: field(),
        transaction_id: field(),
        effective_payer: field(),
        document_amount: field(),
        source_institution: field(),
        destination_institution: field(),
      },
    });

    render(
      <ReceiptInfoList
        type={EReceiptProcessingStatus.FAILED}
        receipts={[receiptWithoutFields]}
      />,
    );
    const props = tableProps();
    expect(props.actions).toBeUndefined();
    expect(props.items[0]).toMatchObject({
      payer: '--',
      category: '--',
      beneficiary: '--',
      source_institution: '--',
      destination_institution: '--',
      paid_amount: 0,
    });
  });
});
