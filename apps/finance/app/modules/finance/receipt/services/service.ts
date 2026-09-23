import { HttpClient ,Result } from '@machado-repo/shared';
import {
  TReceipt ,
  TReceiptBatch ,
  TReceiptFilter,
} from '@/app/modules/finance/receipt';


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
}