import { render } from '@testing-library/react';
import { Form, useAlert, useUser, type FormProps } from '@machado-repo/ui';

import ReceiptInfoConfirm from '../components/info/form/ReceiptInfoForm';
import { Category } from '../../category/domain/Category';
import { EReceiptFieldStatus } from '../types';
import type { TReceiptConfirm } from '../types';

jest.mock('@machado-repo/ui', () => ({
  Form: jest.fn(() => null),
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useUser: jest.fn(() => ({ user: { name: 'Current user' } })),
}));

const item: TReceiptConfirm = {
  id: 'receipt-1',
  category: 'Utilities',
  beneficiary: 'Power Co.',
  paid_amount: 75.5,
  source_institution: 'Example Bank',
};

const categories = [
  Category.create({
    id: 'category-1',
    name: 'Utilities',
    created_at: new Date('2026-10-08T10:00:00.000Z'),
  }),
];

function lastFormProps(): FormProps {
  const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
  if (!props) {
    throw new Error('Expected a rendered receipt confirmation form.');
  }
  return props;
}

describe('ReceiptInfoConfirm', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('prepares default values, uses the current user and submits extracted fields', () => {
    render(
      <ReceiptInfoConfirm
        item={{ ...item, payer: undefined, category: 'Missing category' }}
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );
    const props = lastFormProps();

    expect(props.initialValues).toMatchObject({
      id: 'receipt-1',
      payer: 'Current user',
      category: '',
      due_date: '',
      payment_date: '',
      paid_amount: '75.5',
    });
    const categoryField = props.fields.find((field) => field.name === 'category');
    expect(categoryField).toMatchObject({
      value: '',
      options: [{ key: 'category-1', label: 'Utilities', value: 'Utilities' }],
    });

    props.onSuccess?.({
      payer: 'Changed payer',
      barcode: '123456',
      category: 'Utilities',
      due_date: '2026-10-01',
      discount: '2.5',
      interest: '1.5',
      description: 'Electricity',
      beneficiary: 'Changed beneficiary',
      payment_date: '2026-10-02',
      total_charges: '79.5',
      authentication: 'auth-code',
      transaction_id: 'transaction-1',
      effective_payer: 'Effective payer',
      document_amount: '75.5',
      source_institution: 'Source bank',
      destination_institution: 'Destination bank',
      fine: '0.5',
      paid_amount: '80.25',
    });

    const [submittedItem, extractedData] = onSubmit.mock.calls[0] ?? [];
    expect(submittedItem).toMatchObject({
      id: 'receipt-1',
      payer: 'Changed payer',
      category: 'Utilities',
      beneficiary: 'Changed beneficiary',
      source_institution: 'Source bank',
      destination_institution: 'Destination bank',
      payment_date: new Date('2026-10-02'),
      paid_amount: 80.25,
    });
    expect(extractedData).toMatchObject({
      fine: { value: 0.5, status: EReceiptFieldStatus.FOUND },
      payer: { value: 'Changed payer', status: EReceiptFieldStatus.FOUND },
      barcode: { value: '123456', status: EReceiptFieldStatus.FOUND },
      category: { value: 'Utilities', status: EReceiptFieldStatus.FOUND },
      due_date: { value: new Date('2026-10-01'), status: EReceiptFieldStatus.FOUND },
      discount: { value: 2.5, status: EReceiptFieldStatus.FOUND },
      interest: { value: 1.5, status: EReceiptFieldStatus.FOUND },
      paid_amount: { value: 80.25, status: EReceiptFieldStatus.FOUND },
      beneficiary: { value: 'Changed beneficiary', status: EReceiptFieldStatus.FOUND },
      description: { value: 'Electricity', status: EReceiptFieldStatus.FOUND },
      payment_date: { value: new Date('2026-10-02'), status: EReceiptFieldStatus.FOUND },
      total_charges: { value: 79.5, status: EReceiptFieldStatus.FOUND },
      authentication: { value: 'auth-code', status: EReceiptFieldStatus.FOUND },
      transaction_id: { value: 'transaction-1', status: EReceiptFieldStatus.FOUND },
      effective_payer: { value: 'Effective payer', status: EReceiptFieldStatus.FOUND },
      document_amount: { value: 75.5, status: EReceiptFieldStatus.FOUND },
      source_institution: { value: 'Source bank', status: EReceiptFieldStatus.FOUND },
      destination_institution: { value: 'Destination bank', status: EReceiptFieldStatus.FOUND },
    });
  });

  it('keeps existing values when data is unchanged and leaves empty extracted fields missing', () => {
    render(
      <ReceiptInfoConfirm
        item={{ ...item, payer: 'Existing payer' }}
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );
    const props = lastFormProps();
    props.onSuccess?.({
      payer: 'Existing payer',
      category: 'Utilities',
      paid_amount: '',
      payment_date: 'invalid-date',
    });

    const [submittedItem, extractedData] = onSubmit.mock.calls[0] ?? [];
    expect(submittedItem).toEqual({
      ...item,
      payer: 'Existing payer',
    });
    expect(extractedData.payer.status).toBe(EReceiptFieldStatus.FOUND);
    expect(extractedData.fine.status).toBe(EReceiptFieldStatus.NOT_FOUND);
    expect(extractedData.paid_amount.status).toBe(EReceiptFieldStatus.NOT_FOUND);
    expect(extractedData.payment_date.status).toBe(EReceiptFieldStatus.FOUND);
    expect(Number.isNaN(extractedData.payment_date.value?.getTime())).toBe(true);
  });

  it('reports validation errors, supports cancellation and handles no current user', () => {
    jest.mocked(useUser).mockReturnValueOnce({ user: undefined } as never);
    render(
      <ReceiptInfoConfirm
        item={item}
        categories={[]}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );
    const props = lastFormProps();

    expect(props.initialValues.payer).toBe('');
    props.actions?.cancel?.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
    expect(onCancel).toHaveBeenCalledTimes(1);
    props.onError?.({ isInvalid: true, fields: {}, errorMessage: 'Invalid receipt' });
    const showAlert = jest.mocked(useAlert).mock.results.at(-1)?.value.showAlert;
    expect(showAlert).toHaveBeenCalledWith({
      variant: 'error',
      message: 'Invalid receipt',
      position: 'top-right',
    });
    props.onError?.({ isInvalid: false, fields: {} });
    expect(showAlert).toHaveBeenLastCalledWith({
      variant: 'error',
      message: 'auth.form.validation.error',
      position: 'top-right',
    });
  });
});
