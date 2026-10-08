import { render, screen } from '@testing-library/react';
import { Form, Table, useAlert, useUI, type FormProps, type TableProps } from '@machado-repo/ui';
import { Money, Result } from '@machado-repo/shared';

import PaymentForm from '../components/form/PaymentForm';
import PaymentsList from '../components/list/PaymentsList';
import { Beneficiary } from '../../beneficiary/domain/Beneficiary';
import { Category } from '../../category/domain/Category';
import { Institution } from '../../institution/domain/Institution';
import { Payment } from '../domain/Payment';

jest.mock('@machado-repo/ui', () => ({
  Button: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  ),
  Form: jest.fn(() => null),
  Table: jest.fn(() => null),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useUI: jest.fn(() => ({ locale: 'en-US' })),
}));

const date = new Date('2026-10-08T10:00:00.000Z');
const payment = Payment.create({
  id: 'payment-1',
  amount: 75.5,
  payment_date: date,
  receipt: {
    id: 'receipt-1',
    category: 'category-1',
    beneficiary: 'beneficiary-1',
    paid_amount: 75.5,
    source_institution: 'institution-1',
    payer: 'Payer',
    created_at: date,
  },
  category: Category.create({ id: 'category-1', name: 'Utilities', created_at: date }),
  beneficiary: Beneficiary.create({ id: 'beneficiary-1', name: 'Power Co.', created_at: date }),
  source_institution: Institution.create({ id: 'institution-1', name: 'Bank A', created_at: date }),
  destination_institution: Institution.create({ id: 'institution-2', name: 'Bank B', created_at: date }),
});

function formProps(): FormProps {
  const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
  if (!props) {
    throw new Error('Expected the payment form to be rendered.');
  }
  return props;
}

function tableProps(): TableProps<typeof payment> {
  const props = jest.mocked(Table).mock.calls.at(-1)?.[0] as
    | TableProps<typeof payment>
    | undefined;
  if (!props) {
    throw new Error('Expected the payment table to be rendered.');
  }
  return props;
}

describe('PaymentForm', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('prepares existing values and submits normalized edited payment fields', () => {
    render(<PaymentForm item={payment} onSubmit={onSubmit} onCancel={onCancel} />);
    const props = formProps();

    expect(props.initialValues).toEqual({
      payer: 'Payer',
      amount: '75.5',
      beneficiary: 'Power Co.',
      payment_date: '2026-10-08',
      source_institution: 'Bank A',
      destination_institution: 'Bank B',
    });
    expect(props.fields.find((field) => field.name === 'amount')).toMatchObject({
      value: '75.5',
      required: true,
    });
    props.onSuccess?.({
      payer: 'Updated payer',
      beneficiary: 'Updated beneficiary',
      source_institution: 'Updated source',
      destination_institution: 'Updated destination',
      amount: '8025',
      payment_date: '2026-10-09',
    });
    expect(onSubmit).toHaveBeenCalledWith({
      id: payment.id,
      payer: 'Updated payer',
      beneficiary: 'Updated beneficiary',
      source_institution: 'Updated source',
      destination_institution: 'Updated destination',
      amount: 80.25,
      payment_date: new Date('2026-10-09'),
    });
    props.actions?.cancel?.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('handles absent optional properties, invalid input and validation errors', () => {
    const minimalPayment = Payment.create({
      ...payment,
      destination_institution: undefined,
      amount: 0,
      receipt: {
        ...payment.receipt,
        payer: undefined,
      },
    });
    render(<PaymentForm item={minimalPayment} onSubmit={onSubmit} onCancel={onCancel} />);
    const props = formProps();

    expect(props.initialValues).toMatchObject({
      payer: '',
      destination_institution: '',
      amount: '0',
    });
    props.onSuccess?.({
      payer: '',
      amount: '0',
      payment_date: 'invalid-date',
    });
    expect(onSubmit).toHaveBeenCalledWith({ id: payment.id, amount: 0 });

    props.onError?.({ isInvalid: true, fields: {}, errorMessage: 'Invalid payment' });
    const showAlert = jest.mocked(useAlert).mock.results.at(-1)?.value.showAlert;
    expect(showAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid payment',
      variant: 'error',
    }));
    props.onError?.({ isInvalid: false, fields: {} });
    expect(showAlert).toHaveBeenLastCalledWith(expect.objectContaining({
      message: 'auth.form.validation.error',
    }));
  });

  it('does not add an invalid numeric amount to the update', () => {
    const tryCreate = jest.spyOn(Money, 'tryCreate')
      .mockReturnValueOnce(Result.ok({ valueNumber: Number.NaN } as never));
    render(<PaymentForm item={payment} onSubmit={onSubmit} onCancel={onCancel} />);
    formProps().onSuccess?.({ amount: 'invalid' });

    expect(onSubmit).toHaveBeenCalledWith({ id: payment.id });
    tryCreate.mockRestore();
  });
});

describe('PaymentsList', () => {
  const onEdit = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('shows loading and empty states', () => {
    const { rerender } = render(<PaymentsList payments={[]} isLoading />);
    expect(screen.getByText('common.loading')).toBeTruthy();

    rerender(<PaymentsList payments={[]} isLoading={false} />);
    expect(screen.getByText('finance.payment.empty')).toBeTruthy();
  });

  it('renders the condensed table by default with no actions', () => {
    render(<PaymentsList payments={[payment]} isLoading={false} />);
    const props = tableProps();

    expect(props.headers).toHaveLength(3);
    expect(props.actions).toBeUndefined();
    expect(props.headers[0]?.format?.(payment.payment_date as never, payment)).toBeTruthy();
    expect(props.headers[1]?.format?.(payment.beneficiary as never, payment)).toBe('Power Co.');
    expect(props.headers[2]?.format?.(payment.amount as never, payment)).toBe('$75.50');
    expect(jest.mocked(useUI)).toHaveBeenCalled();
  });

  it('renders the full table and formats optional relations and values', () => {
    const { rerender } = render(
      <PaymentsList payments={[payment]} isLoading={false} resumed={false} onEdit={onEdit} />,
    );
    let props = tableProps();

    expect(props.headers).toHaveLength(7);
    expect(props.actions?.icons).toHaveLength(1);
    expect(props.headers[0]?.format?.(payment.receipt as never, payment)).toBe('Payer');
    expect(props.headers[1]?.format?.(payment.category as never, payment)).toBe('Utilities');
    expect(props.headers[2]?.format?.(payment.beneficiary as never, payment)).toBe('Power Co.');
    expect(props.headers[3]?.format?.(payment.amount as never, payment)).toBe('$75.50');
    expect(props.headers[4]?.format?.(payment.source_institution as never, payment)).toBe('Bank A');
    expect(props.headers[5]?.format?.(undefined as never, payment)).toBe('--');
    expect(props.headers[6]?.format?.(payment.payment_date as never, payment)).toBeTruthy();
    props.actions?.icons?.[0]?.onClick?.(payment);
    expect(onEdit).toHaveBeenCalledWith(payment);

    const paymentWithoutPayer = Payment.create({
      ...payment,
      receipt: { ...payment.receipt, payer: undefined },
      destination_institution: undefined,
    });
    rerender(
      <PaymentsList payments={[paymentWithoutPayer]} isLoading={false} resumed={false} />,
    );
    props = tableProps();
    expect(props.actions).toBeUndefined();
    expect(props.headers[0]?.format?.(paymentWithoutPayer.receipt as never, paymentWithoutPayer)).toBe('--');
    expect(props.headers[5]?.format?.(undefined as never, paymentWithoutPayer)).toBe('--');
  });
});
