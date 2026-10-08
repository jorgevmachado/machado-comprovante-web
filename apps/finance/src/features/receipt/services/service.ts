import { HttpClient, Result, type Result as TResult } from '@machado-repo/shared';

import {
  mapReceiptBatchJsonResult,
  mapReceiptJsonListResult,
  mapReceiptJsonResult,
} from '../mappers/receipt.mapper';
import type {
  ReceiptBatchJson,
  ReceiptJson,
  ReceiptJsonList,
  TReceipt,
  TReceiptBatch,
  TReceiptConfirm,
  TReceiptFilter,
} from '../types';

export class ReceiptService {
  public async getReceipts(params?: TReceiptFilter): Promise<TResult<Array<TReceipt>>> {
    const result = await HttpClient.get<ReceiptJsonList>({
      path: '/receipt',
      baseUrl: '/api',
      config: { params },
    });
    const mapped = mapReceiptJsonListResult(result);
    if (mapped.isFailure) {
      return Result.fail(mapped.errors);
    }
    return Result.try(() => Array.isArray(mapped.instance)
      ? mapped.instance
      : mapped.instance.items);
  }

  public async receiptBatch(files: Array<File>): Promise<TResult<TReceiptBatch>> {
    if (!files.length) {
      return Result.fail('finance.receipt.batch.no_files');
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const result = await HttpClient.post<ReceiptBatchJson>({
      path: '/receipt/batch',
      baseUrl: '/api',
      config: { body: formData },
    });
    return mapReceiptBatchJsonResult(result);
  }

  public async confirmReceipt(receipt: TReceiptConfirm): Promise<TResult<unknown>> {
    return HttpClient.post<unknown>({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: receipt },
    });
  }

  public async updateReceipt(receipt: TReceiptConfirm): Promise<TResult<TReceipt>> {
    const result = await HttpClient.put<ReceiptJson>({
      path: '/receipt',
      baseUrl: '/api',
      config: { body: receipt },
    });
    return mapReceiptJsonResult(result);
  }
}