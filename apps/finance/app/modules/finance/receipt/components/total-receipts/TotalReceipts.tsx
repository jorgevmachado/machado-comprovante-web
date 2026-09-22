import { useMemo } from 'react';
import { Text } from '@machado-repo/ui';
import {
  EReceiptProcessingStatus ,
  TReceipt ,
} from '@/app/modules/finance/receipt';

type ReceiptStatusInfo = { label: string; status: EReceiptProcessingStatus;total: number; }

const initialReceiptStatusInfo: Array<ReceiptStatusInfo> = [
  { label: 'finance.receipt.received', status: EReceiptProcessingStatus.RECEIVED ,total: 0 } ,
  { label: 'finance.receipt.processed', status: EReceiptProcessingStatus.PROCESSED ,total: 0 } ,
  { label: 'finance.receipt.processing', status: EReceiptProcessingStatus.PROCESSING ,total: 0 } ,
  { label: 'finance.receipt.failed', status: EReceiptProcessingStatus.FAILED ,total: 0 } ,
];

type TotalReceiptsProps = {
  receiptsList: Record<EReceiptProcessingStatus ,Array<TReceipt>>;
}

export default function TotalReceipts({
  receiptsList,
}: TotalReceiptsProps) {
  const receiptsStatusInfo: Array<ReceiptStatusInfo> = useMemo(() => {
    const statusInfo = [...initialReceiptStatusInfo];
    if (!receiptsList) {
      return statusInfo;
    }
    return statusInfo.map((item) => {
      switch (item.status) {
        case EReceiptProcessingStatus.RECEIVED:
          return { ...item ,total: receiptsList.RECEIVED.length };
        case EReceiptProcessingStatus.PROCESSED:
          return { ...item ,total: receiptsList.PROCESSED.length };
        case EReceiptProcessingStatus.PROCESSING:
          return { ...item ,total: receiptsList.PROCESSING.length };
        case EReceiptProcessingStatus.FAILED:
          return { ...item ,total: receiptsList.FAILED.length };
        default:
          return item;
      }
    });
  } ,[receiptsList]);

  return (
    <div className="flex flex-row gap-6">
      { receiptsStatusInfo.map((item) => (
        <div key={ item.status } id={ item.status } className="flex-1 overflow-hidden transition-all p-4  rounded-2xl bg-white shadow-md border border-slate-200">
          <Text as="h4">{ item.label }</Text>
          <Text as="h5">{ item.total }</Text>
        </div>
      )) }
    </div>
  );
}