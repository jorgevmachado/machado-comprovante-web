import { HttpClient ,Result } from '@machado-repo/shared';
import {
  TReceipt ,
  TReceiptBatch ,TReceiptConfirm ,
  TReceiptFilter ,
} from '@/app/modules/finance/receipt';
import { TPayment } from '@/app/modules/finance';


export class ReceiptService {
  public async getReceipts(params?: TReceiptFilter): Promise<Result<Array<TReceipt>>> {
    return HttpClient.get<Array<TReceipt>>({
      path: '/receipt',
      baseUrl: '/api',
      config: { params }
    });
  }

  public async receiptBatch(files: Array<File>): Promise<Result<TReceiptBatch>> {
    if(!files.length) {
      return Result.fail('finance.receipt.batch.no_files');
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return HttpClient.post<TReceiptBatch>({
      path: '/receipt/batch',
      baseUrl: '/api',
      config: { body: formData }
    });
  }

  public async confirmReceipt(receipt: TReceiptConfirm): Promise<Result<{ payment: TPayment }>> {
    return HttpClient.post<{ payment: TPayment }>({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: receipt }
    })
  }

  public async updateReceipt(receipt: TReceiptConfirm): Promise<Result<TReceipt>> {
    return HttpClient.put<TReceipt>({
      path: '/receipt',
      baseUrl: '/api',
      config: { body: receipt }
    });
  }
}