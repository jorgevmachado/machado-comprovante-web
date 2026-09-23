import { useCallback ,useEffect ,useMemo ,useState } from 'react';
import { HttpClient } from '@machado-repo/shared';
import { Text ,useAlert ,useModal } from '@machado-repo/ui';

import {
  EReceiptProcessingStatus ,
  TReceipt ,TReceiptConfirm ,TReceiptData ,
} from '@/app/modules/finance/receipt';
import TotalReceipts
  from '@/app/modules/finance/receipt/components/total-receipts';
import ReceiptInfoList
  from '@/app/modules/finance/receipt/components/info/list';
import { TPayment } from '@/app/modules/finance';

import ReceiptInfoConfirm
  from '@/app/modules/finance/receipt/components/info/form';

import ReceiptInfoExtractedData
  from '@/app/modules/finance/receipt/components/info/extracted-data';

type ReceiptInfoProps = {
  type?: EReceiptProcessingStatus;
  receipts: Array<TReceipt>;
  onCallback?: (status: 'error' | 'success') => void;
}
export default function ReceiptInfo({
  type = EReceiptProcessingStatus.RECEIVED,
  receipts,
  onCallback
}: ReceiptInfoProps) {

  const { showAlert } = useAlert();
  const { modal, openModal, closeModal } = useModal();
  const [receiptsState, setReceipts] = useState<Array<TReceipt>>(receipts);

  const receiptsList = useMemo(() => {
    if(receiptsState.length === 0) {
      return null;
    }
    const received = receiptsState.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.RECEIVED);
    const processed = receiptsState.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSED);
    const processing = receiptsState.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSING);
    const failed = receiptsState.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.FAILED);

    return {
      [EReceiptProcessingStatus.RECEIVED]: received,
      [EReceiptProcessingStatus.PROCESSED]: processed,
      [EReceiptProcessingStatus.PROCESSING]: processing,
      [EReceiptProcessingStatus.FAILED]: failed
    };
  }, [receiptsState]);

  const list = useMemo(() => {
    if(!receiptsList) {
      return [];
    }
    return receiptsList[type] || [];
  }, [type, receiptsList]);

  useEffect(() => {
    if(receiptsState.length === 0 && receipts.length > 0) {
      setReceipts(receipts);
    }
  } ,[receipts, receiptsState.length]);

  const confirmReceipt = useCallback( async (receipt: TReceiptConfirm) => {
    const response = await HttpClient.post<{ payment: TPayment }>({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: receipt }
    })

    const variant = response.isOk ? 'success' : 'error';
    showAlert({ message: `finance.receipt.confirm.${variant}`, variant });
    onCallback?.(variant);
  }, [onCallback, showAlert]);

  const handleOpenConfirmReceiptModal = useCallback(async (item: TReceiptConfirm) => {
    openModal({
      title: 'finance.receipt.confirm.title',
      children: 'finance.receipt.confirm.message',
      footer: {
        primary: {
          children: 'finance.receipt.confirm.action',
          onClick: () => {
            confirmReceipt(item);
            closeModal();
          }
        },
        secondary: {
          children: 'form.action.cancel',
          onClick: () => closeModal()
        }
      }
    })
  }, [closeModal, confirmReceipt, openModal]);

  const updateReceiptToConfirm = useCallback((id: string,data: TReceiptData) => {
    const updatedReceipts = receiptsState.map(receipt => {
      if(receipt.id === id) {
        return {
          ...receipt,
          extracted_data: data
        }
      }
      return receipt;
    })
    setReceipts(updatedReceipts);
    closeModal();
  }, [closeModal, receiptsState]);

  const handleOpenFormModal = (item: TReceiptConfirm) => {
    openModal({
      title: 'finance.receipt.edit.title',
      children: <ReceiptInfoConfirm item={item} onSubmit={updateReceiptToConfirm} onCancel={() => closeModal()} />,
    });
  }

  const handleOpenShowModal = (item: TReceiptConfirm) => {
    openModal({
      title: 'finance.receipt.show.title' ,
      children: <ReceiptInfoExtractedData item={item} />,
    });
  }

  return (
    <div className="flex-1 overflow-hidden transition-all p-4  rounded-2xl bg-white shadow-md border border-slate-200">
      <div className="flex flex-row mb-4">
        <Text weight="bold" size="2xl">finance.receipt.info.title</Text>
        <Text weight="bold" size="2xl">:&nbsp;</Text>
        <Text size="2xl">{`finance.receipt.${type.toLowerCase()}`}</Text>
      </div>

      {!receiptsState || receiptsState.length === 0 && (
        <Text weight="bold" as="h4">finance.receipt.info.no-receipts</Text>
      )}
      {receiptsList && (
        <TotalReceipts receiptsList={receiptsList} />
      )}

      {list && list.length > 0 && (
        <ReceiptInfoList
          receipts={list}
          onEdit={handleOpenFormModal}
          onShow={handleOpenShowModal}
          onConfirm={handleOpenConfirmReceiptModal}
          className="mt-6"
        />
      )}
      {modal}
    </div>
  )
}