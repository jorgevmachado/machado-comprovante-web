import { act, renderHook } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { useReceipts } from '../hooks';
import { Receipt } from '../domain/Receipt';
import { receiptService } from '../services';
import { EReceiptFieldStatus, EReceiptProcessingStatus } from '../types';
import type { TReceiptConfirm } from '../types';

jest.mock('@machado-repo/ui', () => ({
  useAlert: () => ({ executeServiceAlert: jest.fn() }),
  useLoading: () => ({
    execute: <T,>(callback: () => Promise<T>) => callback(),
    isLoading: false,
  }),
}));

const missing = { status: EReceiptFieldStatus.NOT_FOUND } as const;
const receipt = Receipt.create({
  id: 'receipt-1',
  file_name: 'receipt.pdf',
  file_type: 'application/pdf',
  file_size: '100',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
  updated_at: undefined,
  processing_status: EReceiptProcessingStatus.PROCESSED,
  extracted_data: {
    fine: missing,
    payer: missing,
    barcode: missing,
    due_date: missing,
    discount: missing,
    category: missing,
    interest: missing,
    description: missing,
    paid_amount: missing,
    beneficiary: missing,
    payment_date: missing,
    total_charges: missing,
    authentication: missing,
    transaction_id: missing,
    effective_payer: missing,
    document_amount: missing,
    source_institution: missing,
    destination_institution: missing,
  },
});

const batch = {
  total: 1,
  items: [],
  failed: 0,
  received: 0,
  processed: 1,
  processing: 0,
};

const confirmation: TReceiptConfirm = {
  id: receipt.id,
  category: 'category-1',
  beneficiary: 'beneficiary-1',
  paid_amount: 10,
  source_institution: 'institution-1',
};

describe('useReceipts', () => {
  const getReceipts = jest.spyOn(receiptService, 'getReceipts');
  const receiptBatch = jest.spyOn(receiptService, 'receiptBatch');
  const confirmReceipt = jest.spyOn(receiptService, 'confirmReceipt');
  const updateReceipt = jest.spyOn(receiptService, 'updateReceipt');

  afterEach(() => jest.resetAllMocks());

  it('loads receipts into state', async () => {
    getReceipts.mockResolvedValueOnce(Result.ok([receipt]));
    const { result } = renderHook(() => useReceipts());

    await act(async () => {
      await result.current.getReceipts({ limit: '10' });
    });

    expect(getReceipts).toHaveBeenCalledWith({ limit: '10' });
    expect(result.current.receipts).toEqual([receipt]);
  });

  it('uploads batches and exposes the returned batch state', async () => {
    receiptBatch.mockResolvedValueOnce(Result.ok(batch));
    const { result } = renderHook(() => useReceipts());
    const file = new File(['receipt'], 'receipt.pdf');

    await act(async () => {
      await expect(result.current.receiptBatchUpload([file])).resolves.toBe(true);
    });

    expect(receiptBatch).toHaveBeenCalledWith([file]);
    expect(result.current.receiptBatch).toEqual(batch);
  });

  it('returns false when batch upload fails', async () => {
    receiptBatch.mockResolvedValueOnce(Result.fail('Upload failed'));
    const { result } = renderHook(() => useReceipts());

    await act(async () => {
      await expect(result.current.receiptBatchUpload([])).resolves.toBe(false);
    });
    expect(result.current.receiptBatch).toBeUndefined();
  });

  it('confirms receipts and reports the service result', async () => {
    confirmReceipt
      .mockResolvedValueOnce(Result.ok(undefined))
      .mockResolvedValueOnce(Result.fail('Could not confirm'));
    const { result } = renderHook(() => useReceipts());

    await act(async () => {
      await expect(result.current.confirmReceipt(confirmation)).resolves.toBe(true);
      await expect(result.current.confirmReceipt(confirmation)).resolves.toBe(false);
    });

    expect(confirmReceipt).toHaveBeenCalledTimes(2);
  });

  it('returns the updated receipt result', async () => {
    updateReceipt.mockResolvedValueOnce(Result.fail('Could not update'));
    const { result } = renderHook(() => useReceipts());

    await act(async () => {
      await expect(result.current.updateReceipt(confirmation)).resolves.toBeUndefined();
    });
    expect(updateReceipt).toHaveBeenCalledWith(confirmation);
  });
});
