import { HttpClient, Result } from '@machado-repo/shared';

import { ReceiptService } from '../services/service';
import type { ReceiptBatchJson, ReceiptJson, TReceiptConfirm } from '../types';

const batch: ReceiptBatchJson = {
  total: 0,
  items: [],
  failed: 0,
  received: 0,
  processed: 0,
  processing: 0,
};

const confirmation: TReceiptConfirm = {
  id: 'receipt-1',
  category: 'category-1',
  beneficiary: 'beneficiary-1',
  paid_amount: 10,
  source_institution: 'institution-1',
};

describe('ReceiptService', () => {
  const service = new ReceiptService();
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => jest.resetAllMocks());

  it('fetches receipts and returns a plain list', async () => {
    get.mockResolvedValueOnce(Result.ok({
      items: [],
      meta: {
        total: 0,
        limit: 10,
        offset: 0,
        total_pages: 0,
        current_page: 1,
      },
    }));

    const result = await service.getReceipts({ limit: '10' });

    expect(get).toHaveBeenCalledWith({
      path: '/receipt',
      baseUrl: '/api',
      config: { params: { limit: '10' } },
    });
    expect(result.instance).toEqual([]);
  });

  it('preserves upstream errors when listing receipts fails', async () => {
    get.mockResolvedValueOnce(Result.fail('Request failed'));

    const result = await service.getReceipts();

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Request failed');
  });

  it('returns a failure when a batch has no files', async () => {
    const result = await service.receiptBatch([]);

    expect(post).not.toHaveBeenCalled();
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('finance.receipt.batch.no_files');
  });

  it('submits batch files as multipart form data and maps the response', async () => {
    post.mockResolvedValueOnce(Result.ok(batch));
    const file = new File(['receipt'], 'receipt.pdf', { type: 'application/pdf' });

    const result = await service.receiptBatch([file]);

    expect(post).toHaveBeenCalledWith({
      path: '/receipt/batch',
      baseUrl: '/api',
      config: {
        body: expect.any(FormData),
      },
    });
    const body = post.mock.calls[0]?.[0].config?.body;
    expect(body).toBeInstanceOf(FormData);
    if (!(body instanceof FormData)) {
      throw new Error('Expected a multipart form data request.');
    }
    expect(body.getAll('files')).toEqual([file]);
    expect(result.instance).toMatchObject(batch);
  });

  it('posts receipt confirmation without transforming the request', async () => {
    post.mockResolvedValueOnce(Result.ok({ confirmed: true }));

    const result = await service.confirmReceipt(confirmation);

    expect(post).toHaveBeenCalledWith({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: confirmation },
    });
    expect(result.instance).toEqual({ confirmed: true });
  });

  it('preserves failures when updating a receipt', async () => {
    put.mockResolvedValueOnce(Result.fail<ReceiptJson>('Receipt not found'));

    const result = await service.updateReceipt(confirmation);

    expect(put).toHaveBeenCalledWith({
      path: '/receipt',
      baseUrl: '/api',
      config: { body: confirmation },
    });
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Receipt not found');
  });
});
