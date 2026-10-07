import { useCallback ,useState } from 'react';
import { Button ,FileUpload, Text } from '@machado-repo/ui';
import { useReceipts } from '@/app/modules/finance/receipt';

type ReceiptBatchProps = {
  onCallback?: (status: 'error' | 'success') => void;
}

export default function ReceiptBatch({ onCallback }: ReceiptBatchProps) {
  const [files, setFiles] = useState<Array<File>>([]);
  const { receiptBatchUpload } = useReceipts();

  const bachReceipts  = useCallback(async () => {
    const result = await receiptBatchUpload(files);
    if(result) {
      setFiles([]);
    }
    const status = result ? 'success' : 'error';
    onCallback?.(status);
  },[files, onCallback, receiptBatchUpload]);

  return (
    <div className="flex flex-col gap-6">
      <Text>Total: {files.length}</Text>
      <FileUpload multiple value={files} onFilesChange={(files) => setFiles(files)} />
      <Button onClick={bachReceipts}>form.action.send</Button>
    </div>
  )
}