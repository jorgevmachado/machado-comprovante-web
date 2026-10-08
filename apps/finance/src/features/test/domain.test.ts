import { Beneficiary } from '../beneficiary/domain/Beneficiary';
import { Category } from '../category/domain/Category';
import { Institution } from '../institution/domain/Institution';
import { Payer } from '../payer/domain/Payer';
import { Payment } from '../payment/domain/Payment';
import { Receipt } from '../receipt/domain/Receipt';
import { EReceiptProcessingStatus, EReceiptFieldStatus } from '../receipt/types';

const validDate = new Date('2026-10-08T12:00:00.000Z');
const invalidDate = new Date(Number.NaN);

describe.each([
  ['beneficiary', Beneficiary],
  ['category', Category],
  ['institution', Institution],
  ['payer', Payer],
] as const)('%s domain entity', (name, Entity) => {
  it('creates an entity with valid dates and optional properties', () => {
    const entity = Entity.create({
      id: `${name}-1`,
      name: 'Example',
      created_at: validDate,
    });

    expect(entity.id).toBe(`${name}-1`);
    expect(entity.created_at).toBe(validDate);
    expect(entity.updated_at).toBeUndefined();
  });

  it('rejects an invalid creation date', () => {
    expect(() => Entity.create({
      id: `${name}-1`,
      name: 'Example',
      created_at: invalidDate,
    })).toThrow(`Invalid ${name} created_at`);
  });

  it('rejects an invalid update date', () => {
    expect(() => Entity.create({
      id: `${name}-1`,
      name: 'Example',
      created_at: validDate,
      updated_at: invalidDate,
    })).toThrow(`Invalid ${name} updated_at`);
  });
});

const extractedData = {
  fine: { status: EReceiptFieldStatus.NOT_FOUND },
  payer: { status: EReceiptFieldStatus.NOT_FOUND },
  barcode: { status: EReceiptFieldStatus.NOT_FOUND },
  due_date: { status: EReceiptFieldStatus.NOT_FOUND },
  discount: { status: EReceiptFieldStatus.NOT_FOUND },
  category: { status: EReceiptFieldStatus.NOT_FOUND },
  interest: { status: EReceiptFieldStatus.NOT_FOUND },
  description: { status: EReceiptFieldStatus.NOT_FOUND },
  paid_amount: { status: EReceiptFieldStatus.NOT_FOUND },
  beneficiary: { status: EReceiptFieldStatus.NOT_FOUND },
  payment_date: { status: EReceiptFieldStatus.NOT_FOUND },
  total_charges: { status: EReceiptFieldStatus.NOT_FOUND },
  authentication: { status: EReceiptFieldStatus.NOT_FOUND },
  transaction_id: { status: EReceiptFieldStatus.NOT_FOUND },
  effective_payer: { status: EReceiptFieldStatus.NOT_FOUND },
  document_amount: { status: EReceiptFieldStatus.NOT_FOUND },
  source_institution: { status: EReceiptFieldStatus.NOT_FOUND },
  destination_institution: { status: EReceiptFieldStatus.NOT_FOUND },
};

describe('Receipt domain entity', () => {
  const props = {
    id: 'receipt-1',
    file_name: 'receipt.pdf',
    file_type: 'application/pdf',
    file_size: '1024',
    created_at: validDate,
    extracted_data: extractedData,
    processing_status: EReceiptProcessingStatus.PROCESSED,
  };

  it('creates a receipt without an update date', () => {
    expect(Receipt.create(props).updated_at).toBeUndefined();
  });

  it('rejects invalid creation and update dates', () => {
    expect(() => Receipt.create({ ...props, created_at: invalidDate }))
      .toThrow('Invalid receipt created_at');
    expect(() => Receipt.create({ ...props, updated_at: invalidDate }))
      .toThrow('Invalid receipt updated_at');
  });
});

describe('Payment domain entity', () => {
  const dependencies = {
    category: Category.create({
      id: 'category-1',
      name: 'Utilities',
      created_at: validDate,
    }),
    beneficiary: Beneficiary.create({
      id: 'beneficiary-1',
      name: 'Utility Co.',
      created_at: validDate,
    }),
    source_institution: Institution.create({
      id: 'institution-1',
      name: 'Bank',
      created_at: validDate,
    }),
  };
  const props = {
    ...dependencies,
    id: 'payment-1',
    amount: 99.5,
    payment_date: validDate,
    receipt: {
      id: 'receipt-1',
      category: 'category-1',
      beneficiary: 'beneficiary-1',
      paid_amount: 99.5,
      source_institution: 'institution-1',
      created_at: validDate,
    },
  };

  it('creates a payment with valid amount and nested dates', () => {
    expect(Payment.create(props)).toMatchObject({
      id: 'payment-1',
      amount: 99.5,
      destination_institution: undefined,
    });
  });

  it('rejects invalid amount, payment date and receipt dates', () => {
    expect(() => Payment.create({ ...props, amount: Number.NaN }))
      .toThrow('Invalid payment amount');
    expect(() => Payment.create({ ...props, payment_date: invalidDate }))
      .toThrow('Invalid payment payment_date');
    expect(() => Payment.create({
      ...props,
      receipt: { ...props.receipt, created_at: invalidDate },
    })).toThrow('Invalid payment receipt created_at');
    expect(() => Payment.create({
      ...props,
      receipt: { ...props.receipt, updated_at: invalidDate },
    })).toThrow('Invalid payment receipt updated_at');
  });
});
