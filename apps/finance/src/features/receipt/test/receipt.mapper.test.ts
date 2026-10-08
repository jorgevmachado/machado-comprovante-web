import { Result } from '@machado-repo/shared';

import { EReceiptFieldStatus, EReceiptProcessingStatus } from '../types';
import type { ReceiptApiData, ReceiptBatchApiData, ReceiptConfirmJson } from '../types';
import {
  mapReceiptApiListResult,
  mapReceiptApiResult,
  mapReceiptBatchApiResult,
  mapReceiptBatchJsonResult,
  mapReceiptJsonListResult,
  mapReceiptJsonResult,
  receiptApiDataToJson,
  receiptJsonToDomain,
  receiptConfirmJsonToApiRequest,
} from '../mappers/receipt.mapper';

const apiReceipt: ReceiptApiData = {
  id: 'receipt-id',
  file_name: 'receipt.pdf',
  file_type: 'application/pdf',
  file_size: '1024',
  created_at: '2026-10-03T23:19:16.993406Z',
  updated_at: null,
  processing_status: EReceiptProcessingStatus.PROCESSED,
  extracted_data: {
    fine: { value: '1.25', status: EReceiptFieldStatus.FOUND },
    payer: { value: null, status: EReceiptFieldStatus.NOT_FOUND },
    barcode: { value: '123', status: EReceiptFieldStatus.FOUND },
    due_date: { value: '1990-01-01', status: EReceiptFieldStatus.FOUND },
    discount: { value: '2.50', status: EReceiptFieldStatus.FOUND },
    category: { value: 'Utilities', status: EReceiptFieldStatus.FOUND },
    interest: { value: '0.10', status: EReceiptFieldStatus.FOUND },
    description: { value: null, status: EReceiptFieldStatus.NOT_FOUND },
    paid_amount: { value: '99.99', status: EReceiptFieldStatus.FOUND },
    beneficiary: { value: 'Beneficiary', status: EReceiptFieldStatus.FOUND },
    payment_date: { value: '1990-01-02', status: EReceiptFieldStatus.FOUND },
    total_charges: { value: 3, status: EReceiptFieldStatus.FOUND },
    authentication: { value: 'auth', status: EReceiptFieldStatus.FOUND },
    transaction_id: { value: 'transaction', status: EReceiptFieldStatus.FOUND },
    effective_payer: { value: 'Payer', status: EReceiptFieldStatus.FOUND },
    document_amount: { value: '97.49', status: EReceiptFieldStatus.FOUND },
    source_institution: { value: 'Bank', status: EReceiptFieldStatus.FOUND },
    destination_institution: { value: null, status: EReceiptFieldStatus.NOT_FOUND },
  },
};

describe('receipt mapper', () => {
  it('converts Decimal strings to numbers and keeps date-only values as calendar dates', () => {
    const json = receiptApiDataToJson(apiReceipt);

    expect(json.extracted_data.fine.value).toBe(1.25);
    expect(json.extracted_data.discount.value).toBe(2.5);
    expect(json.extracted_data.paid_amount.value).toBe(99.99);
    expect(json.extracted_data.due_date.value).toBe('1990-01-01');
    expect(json.extracted_data.payment_date.value).toBe('1990-01-02');
    expect(json.extracted_data.payer.value).toBeUndefined();
  });

  it('hydrates date-only JSON values as UTC Dates without shifting the calendar date', () => {
    const json = receiptApiDataToJson(apiReceipt);
    const receipt = receiptJsonToDomain(json);

    expect(receipt.extracted_data.due_date.value).toBeInstanceOf(Date);
    expect(receipt.extracted_data.due_date.value?.toISOString()).toBe('1990-01-01T00:00:00.000Z');
    expect(receipt.extracted_data.payment_date.value?.toISOString()).toBe('1990-01-02T00:00:00.000Z');
  });

  it('rejects empty Decimal values instead of converting them to zero', () => {
    expect(() => receiptApiDataToJson({
      ...apiReceipt,
      extracted_data: {
        ...apiReceipt.extracted_data,
        paid_amount: { value: ' ', status: EReceiptFieldStatus.FOUND },
      },
    })).toThrow('Invalid receipt paid_amount');
  });

  it('rejects invalid date-only calendar values', () => {
    expect(() => receiptApiDataToJson({
      ...apiReceipt,
      extracted_data: {
        ...apiReceipt.extracted_data,
        due_date: { value: '1990-02-30', status: EReceiptFieldStatus.FOUND },
      },
    })).toThrow('Invalid receipt due_date');
  });

  it('maps receipt API and JSON results and propagates failures', () => {
    const apiResult = mapReceiptApiResult(Result.ok(apiReceipt));
    const apiList = mapReceiptApiListResult(Result.ok([apiReceipt]));
    const jsonResult = mapReceiptJsonResult(Result.ok(apiResult.instance));
    const jsonList = mapReceiptJsonListResult(Result.ok([apiResult.instance]));
    const failed = mapReceiptJsonResult(Result.fail('Receipt unavailable'));

    expect(apiList.instance).toHaveLength(1);
    expect(jsonResult.instance.id).toBe(apiReceipt.id);
    expect(jsonList.instance).toHaveLength(1);
    expect(failed.isFailure).toBe(true);
    expect(failed.error).toBe('Receipt unavailable');
  });

  it('maps uploaded receipt batches with and without extracted data', () => {
    const batch: ReceiptBatchApiData = {
      total: 2,
      failed: 0,
      received: 0,
      processed: 2,
      processing: 0,
      items: [
        {
          id: 'upload-1',
          file_size: '1024',
          created_at: apiReceipt.created_at,
          updated_at: null,
          processing_status: EReceiptProcessingStatus.PROCESSED,
          errors: [],
          file_name: apiReceipt.file_name,
          file_type: apiReceipt.file_type,
          data: apiReceipt.extracted_data,
        },
        {
          id: 'upload-2',
          file_size: '512',
          created_at: apiReceipt.created_at,
          processing_status: EReceiptProcessingStatus.RECEIVED,
          errors: [],
        },
      ],
    };
    const mapped = mapReceiptBatchApiResult(Result.ok(batch));
    const domain = mapReceiptBatchJsonResult(mapped);

    expect(mapped.instance.items[0]?.data?.paid_amount.value).toBe(99.99);
    expect(domain.instance.items[0]?.created_at).toEqual(new Date(apiReceipt.created_at));
    expect(domain.instance.items[0]?.data?.paid_amount.value).toBe(99.99);
    expect(domain.instance.items[1]?.data).toBeUndefined();
  });

  it('normalizes receipt confirmation date strings and rejects invalid values', () => {
    const confirmation: ReceiptConfirmJson = {
      id: 'receipt-1',
      category: 'category-1',
      beneficiary: 'beneficiary-1',
      paid_amount: 10,
      source_institution: 'institution-1',
      due_date: '2026-10-08T14:00:00.000Z',
      payment_date: '2026-10-09',
    };

    expect(receiptConfirmJsonToApiRequest(confirmation)).toMatchObject({
      due_date: '2026-10-08',
      payment_date: '2026-10-09',
    });
    expect(() => receiptConfirmJsonToApiRequest({
      ...confirmation,
      due_date: 'invalid',
    })).toThrow('Invalid receipt due_date');
    expect(receiptConfirmJsonToApiRequest({
      ...confirmation,
      due_date: '',
      payment_date: undefined,
    })).toMatchObject({
      due_date: undefined,
      payment_date: undefined,
    });
    expect(() => receiptConfirmJsonToApiRequest({
      ...confirmation,
      due_date: '2026-10-08Tinvalid',
    })).toThrow('Invalid receipt due_date');
  });
});
