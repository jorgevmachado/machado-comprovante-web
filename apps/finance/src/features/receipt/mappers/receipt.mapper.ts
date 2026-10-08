import {
  DateVO,
  NumberVO,
  type Result as TResult,
} from '@machado-repo/shared';

import { mapListResult, mapResult } from '@/src/shared/result.mapper';
import { Receipt } from '../domain/Receipt';
import { parseDate } from '@/src/shared/result.mapper';
import type {
  ReceiptApiData,
  ReceiptApiList,
  ReceiptApiNumber,
  ReceiptBatchApiData,
  ReceiptBatchJson,
  ReceiptConfirmApiRequest,
  ReceiptConfirmJson,
  ReceiptJson,
  ReceiptJsonList,
  ReceiptDomainList,
  ReceiptUploadApiData,
  ReceiptUploadJson,
  TReceiptApiData,
  TReceiptBatch,
  TReceiptData,
  TReceiptJsonData,
} from '../types';

function parseNumber(value: ReceiptApiNumber | undefined, field: string): number | undefined {
  if (value == null) {
    return undefined;
  }

  const result = NumberVO.tryCreate(value);
  if (result.isFailure) {
    throw new Error(`Invalid receipt ${field}: ${value}`);
  }

  return result.instance.value;
}

function requireDateOnly(value: string | null | undefined, field: string): Date | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  const date = DateVO.format.dateStringToDate(value);
  if (!date) {
    throw new Error(`Invalid receipt ${field}: ${value}`);
  }

  return date;
}

function mapField<TInput, TOutput>(
  field: { value?: TInput | null; status: TReceiptData['fine']['status'] },
  mapper: (value: NonNullable<TInput>) => TOutput | undefined,
): { value?: TOutput; status: TReceiptData['fine']['status'] } {
  const { value, ...properties } = field;
  return {
    ...properties,
    value: value == null ? undefined : mapper(value),
  };
}

function apiDataToDomain(data: TReceiptApiData): TReceiptData {
  return {
    ...data,
    payer: mapField(data.payer, (value) => value),
    barcode: mapField(data.barcode, (value) => value),
    category: mapField(data.category, (value) => value),
    description: mapField(data.description, (value) => value),
    beneficiary: mapField(data.beneficiary, (value) => value),
    authentication: mapField(data.authentication, (value) => value),
    transaction_id: mapField(data.transaction_id, (value) => value),
    effective_payer: mapField(data.effective_payer, (value) => value),
    source_institution: mapField(data.source_institution, (value) => value),
    destination_institution: mapField(data.destination_institution, (value) => value),
    fine: mapField(data.fine, (value) => parseNumber(value, 'fine')),
    discount: mapField(data.discount, (value) => parseNumber(value, 'discount')),
    interest: mapField(data.interest, (value) => parseNumber(value, 'interest')),
    paid_amount: mapField(data.paid_amount, (value) => parseNumber(value, 'paid_amount')),
    total_charges: mapField(data.total_charges, (value) => parseNumber(value, 'total_charges')),
    document_amount: mapField(data.document_amount, (value) => parseNumber(value, 'document_amount')),
    due_date: mapField(data.due_date, (value) => requireDateOnly(value, 'due_date')),
    payment_date: mapField(data.payment_date, (value) => requireDateOnly(value, 'payment_date')),
  };
}

function domainDataToJson(data: TReceiptData): TReceiptJsonData {
  return {
    ...data,
    due_date: {
      ...data.due_date,
      value: data.due_date.value
        ? DateVO.format.dateToDateString(data.due_date.value)
        : undefined,
    },
    payment_date: {
      ...data.payment_date,
      value: data.payment_date.value
        ? DateVO.format.dateToDateString(data.payment_date.value)
        : undefined,
    },
  };
}

function apiDataToJson(data: TReceiptApiData): TReceiptJsonData {
  return domainDataToJson(apiDataToDomain(data));
}

function jsonDataToDomain(data: TReceiptJsonData): TReceiptData {
  return apiDataToDomain(data);
}

export function receiptApiDataToDomain(data: ReceiptApiData): Receipt {
  return Receipt.create({
    ...data,
    created_at: parseDate(data.created_at, 'created_at', 'receipt'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'receipt'),
    extracted_data: apiDataToDomain(data.extracted_data),
  });
}

export function receiptJsonToDomain(data: ReceiptJson): Receipt {
  return Receipt.create({
    ...data,
    created_at: parseDate(data.created_at, 'created_at', 'receipt'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'receipt'),
    extracted_data: jsonDataToDomain(data.extracted_data),
  });
}

export function receiptApiDataToJson(data: ReceiptApiData): ReceiptJson {
  const receipt = receiptApiDataToDomain(data);
  const {
    created_at: createdAt,
    updated_at: updatedAt,
    extracted_data: extractedData,
    ...properties
  } = receipt;
  return {
    ...properties,
    created_at: createdAt.toISOString(),
    ...(updatedAt ? { updated_at: updatedAt.toISOString() } : {}),
    extracted_data: domainDataToJson(extractedData),
  };
}

export function mapReceiptApiListResult(
  result: TResult<ReceiptApiList>,
): TResult<ReceiptJsonList> {
  return mapListResult(result, receiptApiDataToJson);
}

export function mapReceiptJsonListResult(
  result: TResult<ReceiptJsonList>,
): TResult<ReceiptDomainList> {
  return mapListResult(result, receiptJsonToDomain);
}

function apiUploadToJson(item: ReceiptUploadApiData): ReceiptUploadJson {
  const { created_at, updated_at, data, ...properties } = item;
  return {
    ...properties,
    created_at,
    ...(updated_at == null ? {} : { updated_at }),
    ...(data ? { data: apiDataToJson(data) } : {}),
  };
}

function batchApiToJson(batch: ReceiptBatchApiData): ReceiptBatchJson {
  return {
    ...batch,
    items: batch.items.map(apiUploadToJson),
  };
}

function uploadJsonToDomain(item: ReceiptUploadJson) {
  const { created_at, updated_at, data, ...properties } = item;
  return {
    ...properties,
    created_at: parseDate(created_at, 'created_at', 'receipt'),
    updated_at: updated_at == null
      ? undefined
      : parseDate(updated_at, 'updated_at', 'receipt'),
    ...(data ? { data: jsonDataToDomain(data) } : {}),
  };
}

function batchJsonToDomain(batch: ReceiptBatchJson): TReceiptBatch {
  return {
    ...batch,
    items: batch.items.map(uploadJsonToDomain),
  };
}

export function mapReceiptBatchApiResult(
  result: TResult<ReceiptBatchApiData>,
): TResult<ReceiptBatchJson> {
  return mapResult(result, batchApiToJson);
}

export function mapReceiptBatchJsonResult(
  result: TResult<ReceiptBatchJson>,
): TResult<TReceiptBatch> {
  return mapResult(result, batchJsonToDomain);
}

function normalizeDateRequest(value: string | undefined, field: string): string | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  const datePart = value.slice(0, 10);
  if (
    value.length > 10 &&
    (!value.startsWith(`${datePart}T`) || !DateVO.format.dateTimeStringToDate(value))
  ) {
    throw new Error(`Invalid receipt ${field}: ${value}`);
  }
  const parsed = requireDateOnly(datePart, field);
  if (!parsed) {
    throw new Error(`Invalid receipt ${field}: ${value}`);
  }
  return DateVO.format.dateToDateString(parsed);
}

export function receiptConfirmJsonToApiRequest(
  receipt: ReceiptConfirmJson,
): ReceiptConfirmApiRequest {
  return {
    ...receipt,
    due_date: normalizeDateRequest(receipt.due_date, 'due_date'),
    payment_date: normalizeDateRequest(receipt.payment_date, 'payment_date'),
  };
}

export function mapReceiptApiResult(
  result: TResult<ReceiptApiData>,
): TResult<ReceiptJson> {
  return mapResult(result, receiptApiDataToJson);
}

export function mapReceiptJsonResult(
  result: TResult<ReceiptJson>,
): TResult<Receipt> {
  return mapResult(result, receiptJsonToDomain);
}
