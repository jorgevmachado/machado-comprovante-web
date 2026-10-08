import { Result } from '@machado-repo/shared';

import {
  EReceiptFieldStatus,
  EReceiptProcessingStatus,
} from '../../receipt/types';
import type { ReceiptApiData } from '../../receipt/types';
import type {
  PaymentApiData,
  PaymentDashboardApiResponse,
  TPaymentFilter,
} from '../types';
import {
  mapPaymentApiListResult,
  mapPaymentApiResult,
  mapPaymentCountApiResult,
  mapPaymentDashboardApiResult,
  mapPaymentJsonListResult,
  mapPaymentJsonResult,
  mapPaymentMaxApiResult,
  mapPaymentTotalApiResult,
  paymentApiDataToJson,
  paymentDashboardParamsToApi,
  paymentDashboardApiToJson,
  paymentDashboardJsonToDomain,
  paymentDateParamsToApi,
  paymentDateQueryToApi,
  paymentFilterToApiParams,
  paymentJsonToDomain,
  paymentPersistToApiRequest,
  paymentPersistJsonToApiRequest,
} from '../mappers/payment.mapper';

const missing = { status: EReceiptFieldStatus.NOT_FOUND } as const;
const found = <T>(value: T) => ({ status: EReceiptFieldStatus.FOUND, value });

const receipt: ReceiptApiData = {
  id: 'receipt-id',
  file_name: 'receipt.pdf',
  file_type: 'application/pdf',
  file_size: '1024',
  created_at: '2026-10-03T23:19:16.993406Z',
  processing_status: EReceiptProcessingStatus.PROCESSED,
  extracted_data: {
    fine: found('1.25'),
    payer: found('Payer'),
    barcode: found('123'),
    due_date: found('1990-01-01'),
    discount: found('2.50'),
    category: found('Utilities'),
    interest: found('0.10'),
    description: missing,
    paid_amount: found('99.99'),
    beneficiary: found('Beneficiary'),
    payment_date: found('1990-01-02'),
    total_charges: found('3.75'),
    authentication: missing,
    transaction_id: missing,
    effective_payer: missing,
    document_amount: found('97.49'),
    source_institution: found('Bank'),
    destination_institution: missing,
  },
};

const payment: PaymentApiData = {
  id: 'payment-id',
  amount: '99.99',
  payment_date: '1990-01-02',
  receipt,
  category: {
    id: 'category-id',
    name: 'Utilities',
    created_at: '2026-10-03T23:19:16.993406Z',
  },
  beneficiary: {
    id: 'beneficiary-id',
    name: 'Beneficiary',
    created_at: '2026-10-03T23:19:16.993406Z',
  },
  source_institution: {
    id: 'source-id',
    name: 'Bank',
    created_at: '2026-10-03T23:19:16.993406Z',
  },
  destination_institution: null,
};

const dashboard: PaymentDashboardApiResponse = {
  payers: [{ name: 'Payer', payer_id: 'payer-id', count: '2', total: '100.50' }],
  period: { start_date: '2026-09-01', end_date: '2026-10-01' },
  summary: { total: '100.50', count: '2', average: '50.25', highest: '90.00' },
  monthly: [{ total: '100.50', count: '2', period: '2026-09' }],
  categories: [{ name: 'Utilities', category_id: 'category-id', count: 2, total: '100.50' }],
  institutions: [{ institution: 'Bank', count: 2, total: '100.50' }],
  beneficiaries: [{ name: 'Beneficiary', beneficiary_id: 'beneficiary-id', count: 2, total: '100.50' }],
};

describe('payment mapper', () => {
  it('normalizes payment Decimal values and nested receipt data for JSON', () => {
    const json = paymentApiDataToJson(payment);

    expect(json.amount).toBe(99.99);
    expect(json.payment_date).toBe('1990-01-02');
    expect(json.receipt.paid_amount).toBe(99.99);
    expect(json.receipt.due_date).toBe('1990-01-01');
    expect(json.category.created_at).toBe('2026-10-03T23:19:16.993Z');
    expect(json.destination_institution).toBeUndefined();
  });

  it('hydrates JSON response relations and dates into domain entities', () => {
    const domain = paymentJsonToDomain(paymentApiDataToJson(payment));

    expect(domain.payment_date).toBeInstanceOf(Date);
    expect(domain.payment_date.toISOString()).toBe('1990-01-02T00:00:00.000Z');
    expect(domain.category.created_at).toBeInstanceOf(Date);
    expect(domain.receipt.payment_date?.toISOString()).toBe('1990-01-02T00:00:00.000Z');
  });

  it('converts dashboard decimal strings and period dates', () => {
    const json = paymentDashboardApiToJson(dashboard);
    const domain = paymentDashboardJsonToDomain(json);

    expect(json.summary.total).toBe(100.5);
    expect(json.payers[0]?.total).toBe(100.5);
    expect(domain.period.start_date.toISOString()).toBe('2026-09-01T00:00:00.000Z');
  });

  it('serializes edited date values as calendar dates for the API', () => {
    const request = paymentPersistJsonToApiRequest({
      payment_date: '2026-10-08T03:00:00.000Z',
      amount: 23,
    });

    expect(request.payment_date).toBe('2026-10-08');
  });

  it('rejects invalid Date objects in payment update payloads', () => {
    expect(() => paymentPersistToApiRequest({
      id: 'payment-1',
      payment_date: new Date(Number.NaN),
    })).toThrow('Invalid payment payment_date');
  });

  it('rejects invalid amounts and calendar dates', () => {
    expect(() => paymentApiDataToJson({ ...payment, amount: 'not-a-number' }))
      .toThrow('Invalid payment amount');
    expect(() => paymentApiDataToJson({ ...payment, payment_date: '1990-02-30' }))
      .toThrow('Invalid payment payment_date');
  });

  it('maps payment API and JSON result variants while preserving failures', () => {
    const apiResult = mapPaymentApiResult(Result.ok(payment));
    const apiListResult = mapPaymentApiListResult(Result.ok([payment]));
    const jsonResult = mapPaymentJsonResult(Result.ok(apiResult.instance));
    const jsonListResult = mapPaymentJsonListResult(Result.ok([apiResult.instance]));
    const failed = mapPaymentApiResult(Result.fail<PaymentApiData>('API failed'));

    expect(apiResult.isOk).toBe(true);
    expect(apiListResult.instance).toHaveLength(1);
    expect(jsonResult.instance.id).toBe(payment.id);
    expect(jsonListResult.instance).toHaveLength(1);
    expect(failed.isFailure).toBe(true);
    expect(failed.error).toBe('API failed');
  });

  it('maps summary and dashboard result variants and catches invalid values', () => {
    const count = mapPaymentCountApiResult(Result.ok({ count: '4' }));
    const total = mapPaymentTotalApiResult(Result.ok({ total: '125.50' }));
    const max = mapPaymentMaxApiResult(Result.ok({}));
    const dashboardResult = mapPaymentDashboardApiResult(Result.ok(dashboard));
    const invalid = mapPaymentCountApiResult(Result.ok({ count: 'not-a-number' }));

    expect(count.instance.count).toBe(4);
    expect(total.instance.total).toBe(125.5);
    expect(max.instance.payment).toBeUndefined();
    expect(dashboardResult.instance.summary.total).toBe(100.5);
    expect(invalid.isFailure).toBe(true);
    expect(invalid.error).toContain('Invalid payment count');
  });

  it('normalizes date filters, optional fields and update payloads', () => {
    const date = new Date('2026-10-08T12:00:00.000Z');
    const filters: TPaymentFilter = {
      page: '2',
      payer: 'payer-1',
      start_date: date,
      end_date: '2026-10-31',
    };

    expect(paymentDateParamsToApi({ startDate: date, endDate: '2026-10-31' }))
      .toEqual({ start_date: '2026-10-08', end_date: '2026-10-31' });
    expect(paymentDateParamsToApi()).toBeUndefined();
    expect(paymentDateQueryToApi({ startDate: '2026-10-08', end_date: '2026-10-31' }))
      .toEqual({ start_date: '2026-10-08', end_date: '2026-10-31' });
    expect(paymentDateQueryToApi()).toBeUndefined();
    expect(paymentFilterToApiParams(filters)).toEqual({
      page: '2',
      payer: 'payer-1',
      start_date: '2026-10-08',
      end_date: '2026-10-31',
    });
    expect(paymentPersistToApiRequest({ id: 'payment-1', payment_date: date }))
      .toEqual({ id: 'payment-1', payment_date: '2026-10-08' });
    expect(paymentPersistToApiRequest({ id: 'payment-1' })).toEqual({ id: 'payment-1' });
    expect(paymentPersistJsonToApiRequest({ payment_date: '2026-10-08T08:00:00.000Z' }))
      .toEqual({ payment_date: '2026-10-08' });
  });

  it('serializes dashboard filters and rejects invalid date filters', () => {
    expect(paymentDashboardParamsToApi({
      institution: 'bank-1',
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    })).toEqual({
      institution: 'bank-1',
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    });
    expect(paymentDashboardParamsToApi({})).toEqual({});
    expect(() => paymentFilterToApiParams({ start_date: 'invalid' }))
      .toThrow('Invalid payment start_date');
  });
});
