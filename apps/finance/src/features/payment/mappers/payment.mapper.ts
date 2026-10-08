import {
  DateVO,
  NumberVO,
  type Result as TResult,
} from '@machado-repo/shared';

import { mapListResult, mapResult } from '@/src/shared/result.mapper';
import { parseDate as parseSharedDate } from '@/src/shared/result.mapper';
import { beneficiaryApiDataToJson, beneficiaryJsonToDomain } from '../../beneficiary/mappers/beneficiary.mapper';
import { categoryApiDataToJson, categoryJsonToDomain } from '../../category/mappers/category.mapper';
import { institutionApiDataToJson, institutionJsonToDomain } from '../../institution/mappers/institution.mapper';
import {
  receiptApiDataToDomain,
  receiptApiDataToJson,
} from '../../receipt/mappers/receipt.mapper';
import { Payment } from '../domain/Payment';
import type {
  PaymentApiData,
  PaymentApiList,
  PaymentDashboardApiResponse,
  PaymentDashboardJson,
  PaymentDomainList,
  PaymentJson,
  PaymentJsonList,
  TPayment,
  PaymentPersistApiRequest,
  PaymentUpdateApiBody,
  PaymentSummaryCountApiData,
  PaymentSummaryCountJson,
  PaymentSummaryMaxApiData,
  PaymentSummaryMaxJson,
  PaymentSummaryTotalApiData,
  PaymentSummaryTotalJson,
  PaymentServiceDateParams,
  TPaymentDashboard,
  TPaymentDashboardParams,
  TPaymentPersist,
  TPaymentFilter,
} from '../types';

function parseNumber(value: number | string, field: string): number {
  const result = NumberVO.tryCreate(value);
  if (result.isFailure) {
    throw new Error(`Invalid payment ${field}: ${value}`);
  }
  return result.instance.value;
}

function parseDate(value: string, field: string): Date {
  return parseSharedDate(
    value,
    field,
    'payment',
    (date) => /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? DateVO.format.dateStringToDate(date)
      : DateVO.format.dateTimeStringToDate(date),
  );
}

function formatDateOnly(value: Date, field: string): string {
  const formatted = DateVO.format.dateToDateString(value);
  if (!formatted) {
    throw new Error(`Invalid payment ${field}: ${value}`);
  }
  return formatted;
}

function receiptApiToPaymentDomain(receipt: PaymentApiData['receipt']): TPayment['receipt'] {
  const domainReceipt = receiptApiDataToDomain(receipt);
  const data = domainReceipt.extracted_data;
  return {
    id: domainReceipt.id,
    fine: data.fine.value,
    payer: data.payer.value,
    barcode: data.barcode.value,
    due_date: data.due_date.value,
    category: data.category.value ?? '',
    discount: data.discount.value,
    interest: data.interest.value,
    beneficiary: data.beneficiary.value ?? '',
    description: data.description.value,
    paid_amount: data.paid_amount.value ?? 0,
    payment_date: data.payment_date.value,
    total_charges: data.total_charges.value,
    authentication: data.authentication.value,
    transaction_id: data.transaction_id.value,
    effective_payer: data.effective_payer.value,
    document_amount: data.document_amount.value,
    source_institution: data.source_institution.value ?? '',
    destination_institution: data.destination_institution.value ?? '',
    created_at: domainReceipt.created_at,
    updated_at: domainReceipt.updated_at,
  };
}

function receiptApiToPaymentJson(receipt: PaymentApiData['receipt']): PaymentJson['receipt'] {
  const json = receiptApiDataToJson(receipt);
  const data = json.extracted_data;
  return {
    id: json.id,
    fine: data.fine.value,
    payer: data.payer.value,
    barcode: data.barcode.value,
    due_date: data.due_date.value,
    category: data.category.value ?? '',
    discount: data.discount.value,
    interest: data.interest.value,
    beneficiary: data.beneficiary.value ?? '',
    description: data.description.value,
    paid_amount: data.paid_amount.value ?? 0,
    payment_date: data.payment_date.value,
    total_charges: data.total_charges.value,
    authentication: data.authentication.value,
    transaction_id: data.transaction_id.value,
    effective_payer: data.effective_payer.value,
    document_amount: data.document_amount.value,
    source_institution: data.source_institution.value ?? '',
    destination_institution: data.destination_institution.value ?? '',
    created_at: json.created_at,
    ...(json.updated_at ? { updated_at: json.updated_at } : {}),
  };
}

export function paymentApiDataToDomain(data: PaymentApiData): Payment {
  return Payment.create({
    id: data.id,
    amount: parseNumber(data.amount, 'amount'),
    payment_date: parseDate(data.payment_date, 'payment_date'),
    receipt: receiptApiToPaymentDomain(data.receipt),
    category: categoryJsonToDomain(categoryApiDataToJson(data.category)),
    beneficiary: beneficiaryJsonToDomain(beneficiaryApiDataToJson(data.beneficiary)),
    source_institution: institutionJsonToDomain(institutionApiDataToJson(data.source_institution)),
    destination_institution: data.destination_institution
      ? institutionJsonToDomain(institutionApiDataToJson(data.destination_institution))
      : undefined,
  });
}

export function paymentApiDataToJson(data: PaymentApiData): PaymentJson {
  const payment = paymentApiDataToDomain(data);
  return {
    id: payment.id,
    amount: payment.amount,
    payment_date: formatDateOnly(payment.payment_date, 'payment_date'),
    receipt: receiptApiToPaymentJson(data.receipt),
    category: categoryApiDataToJson(data.category),
    beneficiary: beneficiaryApiDataToJson(data.beneficiary),
    source_institution: institutionApiDataToJson(data.source_institution),
    ...(data.destination_institution
      ? { destination_institution: institutionApiDataToJson(data.destination_institution) }
      : {}),
  };
}

export function paymentJsonToDomain(data: PaymentJson): Payment {
  const paymentDate = parseDate(data.payment_date, 'payment_date');
  const receipt = data.receipt;
  const receiptPayment: TPayment['receipt'] = {
    ...receipt,
    created_at: parseDate(receipt.created_at, 'receipt.created_at'),
    updated_at: receipt.updated_at
      ? parseDate(receipt.updated_at, 'receipt.updated_at')
      : undefined,
    due_date: receipt.due_date
      ? parseDate(receipt.due_date, 'receipt.due_date')
      : undefined,
    payment_date: receipt.payment_date
      ? parseDate(receipt.payment_date, 'receipt.payment_date')
      : undefined,
  };

  return Payment.create({
    ...data,
    payment_date: paymentDate,
    receipt: receiptPayment,
    category: categoryJsonToDomain(data.category),
    beneficiary: beneficiaryJsonToDomain(data.beneficiary),
    source_institution: institutionJsonToDomain(data.source_institution),
    destination_institution: data.destination_institution
      ? institutionJsonToDomain(data.destination_institution)
      : undefined,
  });
}

export function mapPaymentApiListResult(
  result: TResult<PaymentApiList>,
): TResult<PaymentJsonList> {
  return mapListResult(result, paymentApiDataToJson);
}

export function mapPaymentJsonListResult(
  result: TResult<PaymentJsonList>,
): TResult<PaymentDomainList> {
  return mapListResult(result, paymentJsonToDomain);
}

export function mapPaymentApiResult(
  result: TResult<PaymentApiData>,
): TResult<PaymentJson> {
  return mapResult(result, paymentApiDataToJson);
}

export function mapPaymentMaxApiResult(
  result: TResult<PaymentSummaryMaxApiData>,
): TResult<PaymentSummaryMaxJson> {
  return mapResult(result, (data) => ({
    ...(data.payment
      ? { payment: paymentApiDataToJson(data.payment) }
      : {}),
  }));
}

export function mapPaymentMaxJsonResult(
  result: TResult<{ payment?: PaymentJson }>,
): TResult<{ payment?: TPayment }> {
  return mapResult(result, (data) => ({
    ...(data.payment
      ? { payment: paymentJsonToDomain(data.payment) }
      : {}),
  }));
}

export function mapPaymentJsonResult(
  result: TResult<PaymentJson>,
): TResult<Payment> {
  return mapResult(result, paymentJsonToDomain);
}

function mapDashboardNumber<T extends { total: number | string; count: number | string }>(
  item: T,
): Omit<T, 'total' | 'count'> & { total: number; count: number } {
  return {
    ...item,
    total: parseNumber(item.total, 'dashboard.total'),
    count: parseNumber(item.count, 'dashboard.count'),
  };
}

export function paymentDashboardApiToJson(
  data: PaymentDashboardApiResponse,
): PaymentDashboardJson {
  return {
    ...data,
    period: { ...data.period },
    summary: {
      total: parseNumber(data.summary.total, 'dashboard.summary.total'),
      count: parseNumber(data.summary.count, 'dashboard.summary.count'),
      average: parseNumber(data.summary.average, 'dashboard.summary.average'),
      highest: parseNumber(data.summary.highest, 'dashboard.summary.highest'),
    },
    payers: data.payers.map(mapDashboardNumber),
    monthly: data.monthly.map(mapDashboardNumber),
    categories: data.categories.map(mapDashboardNumber),
    institutions: data.institutions.map(mapDashboardNumber),
    beneficiaries: data.beneficiaries.map(mapDashboardNumber),
  };
}

export function paymentDashboardJsonToDomain(
  data: PaymentDashboardJson,
): TPaymentDashboard {
  return {
    ...data,
    period: {
      start_date: parseDate(data.period.start_date, 'dashboard.period.start_date'),
      end_date: parseDate(data.period.end_date, 'dashboard.period.end_date'),
    },
  };
}

export function mapPaymentDashboardApiResult(
  result: TResult<PaymentDashboardApiResponse>,
): TResult<PaymentDashboardJson> {
  return mapResult(result, paymentDashboardApiToJson);
}

export function mapPaymentDashboardJsonResult(
  result: TResult<PaymentDashboardJson>,
): TResult<TPaymentDashboard> {
  return mapResult(result, paymentDashboardJsonToDomain);
}

export function mapPaymentCountApiResult(
  result: TResult<PaymentSummaryCountApiData>,
): TResult<PaymentSummaryCountJson> {
  return mapResult(result, (data) => ({
    count: parseNumber(data.count, 'count'),
  }));
}

export function mapPaymentTotalApiResult(
  result: TResult<PaymentSummaryTotalApiData>,
): TResult<PaymentSummaryTotalJson> {
  return mapResult(result, (data) => ({
    total: parseNumber(data.total, 'total'),
  }));
}

export function mapPaymentCountJsonResult(
  result: TResult<PaymentSummaryCountJson>,
): TResult<PaymentSummaryCountJson> {
  return mapResult(result, (data) => ({
    count: parseNumber(data.count, 'count'),
  }));
}

export function mapPaymentTotalJsonResult(
  result: TResult<PaymentSummaryTotalJson>,
): TResult<PaymentSummaryTotalJson> {
  return mapResult(result, (data) => ({
    total: parseNumber(data.total, 'total'),
  }));
}

export function paymentDateParamsToApi(
  params?: PaymentServiceDateParams,
): Record<string, string> | undefined {
  if (!params) {
    return undefined;
  }
  const startDate = normalizeDateInput(params.startDate, 'start_date');
  const endDate = normalizeDateInput(params.endDate, 'end_date');
  return {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  };
}

export function paymentDateQueryToApi(
  params?: Record<string, string>,
): Record<string, string> | undefined {
  if (!params) {
    return undefined;
  }
  const startDate = normalizeDateInput(
    params.start_date ?? params.startDate,
    'start_date',
  );
  const endDate = normalizeDateInput(
    params.end_date ?? params.endDate,
    'end_date',
  );
  return {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  };
}

function normalizeDateInput(value: Date | string | undefined, field: string): string | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  const date = value instanceof Date
    ? value
    : parseDate(value, field);
  const result = DateVO.tryCreate(date);
  if (result.isFailure) {
    throw new Error(`Invalid payment ${field}: ${result.error}`);
  }
  return DateVO.format.dateToDateString(date);
}

export function paymentFilterToApiParams(
  params: TPaymentFilter,
): Record<string, string> {
  const { start_date, end_date, ...filters } = params;
  const startDate = normalizeDateInput(start_date, 'start_date');
  const endDate = normalizeDateInput(end_date, 'end_date');
  return {
    ...Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => value != null)
        .map(([key, value]) => [key, String(value)]),
    ),
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  };
}

export function paymentPersistToApiRequest(
  item: TPaymentPersist,
): PaymentPersistApiRequest {
  const { payment_date, ...properties } = item;
  return {
    ...properties,
    ...(payment_date
      ? { payment_date: normalizeDateInput(payment_date, 'payment_date') }
      : {}),
  };
}

export function paymentPersistJsonToApiRequest(
  item: PaymentUpdateApiBody,
): PaymentUpdateApiBody {
  const { payment_date, ...properties } = item;
  return {
    ...properties,
    ...(payment_date
      ? { payment_date: normalizeDateInput(payment_date, 'payment_date') }
      : {}),
  };
}

export function paymentDashboardParamsToApi(
  params: Partial<TPaymentDashboardParams>,
): Record<string, string> {
  const startDate = normalizeDateInput(params.start_date, 'start_date');
  const endDate = normalizeDateInput(params.end_date, 'end_date');
  return {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
    ...(params.institution ? { institution: params.institution } : {}),
  };
}
