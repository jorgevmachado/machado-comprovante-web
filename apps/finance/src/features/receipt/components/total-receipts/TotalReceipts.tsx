import { useMemo } from 'react';
import { Text } from '@machado-repo/ui';
import {
  EReceiptProcessingStatus ,
  TReceipt ,
} from '../../types';

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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      { receiptsStatusInfo.map((item) => (
        <div key={ item.status } id={ item.status } className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <Text as="h4" className="break-words text-slate-600">{ item.label }</Text>
          <Text as="h5" weight="bold" size="2xl" className="mt-2">{ item.total }</Text>
        </div>
      )) }
    </div>
  );
}