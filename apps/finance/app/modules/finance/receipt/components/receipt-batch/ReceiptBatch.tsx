import { useCallback ,useState } from 'react';
import { Button ,FileUpload } from '@machado-repo/ui';
import { receiptService } from '@/app/modules/finance/receipt';

type ReceiptBatchProps = {
  onCallback?: (status: 'error' | 'success') => void;
}

export default function ReceiptBatch({ onCallback }: ReceiptBatchProps) {
  const [files, setFiles] = useState<Array<File>>([]);

  const bachReceipts  = useCallback(async () => {
    const response = await receiptService.receiptBatch(files);
    if(response.isFailure) {
      onCallback?.('error');
      return;
    }
    onCallback?.('success');
  },[files, onCallback]);

  return (
    <div className="flex flex-col gap-6">
      <FileUpload multiple onFilesChange={(files) => setFiles(files)} />
      <Button onClick={bachReceipts}>form.action.send</Button>
    </div>
  )
}