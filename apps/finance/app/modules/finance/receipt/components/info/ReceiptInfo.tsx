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
  refresh: boolean;
  onUpdated?: (refresh: boolean) => void;
}
export default function ReceiptInfo({type = EReceiptProcessingStatus.RECEIVED, refresh, onUpdated}: ReceiptInfoProps) {
  const { showAlert } = useAlert();
  const { modal, openModal, closeModal } = useModal();
  const [receipts, setReceipts] = useState<Array<TReceipt>>([]);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    const response = await HttpClient.get<Array<TReceipt>>({
      path: '/receipt',
      baseUrl: '/api',
    });
    if(response.isOk) {
      setReceipts(response.instance);
    }
    return response.instance;
  }, []);

  const refreshData = useCallback(async () => {
    if(!refreshList) {
      return;
    }
    await fetchData();
    setRefreshList(false);
    onUpdated?.(false);
  }, [fetchData, onUpdated, refreshList]);

  const receiptsList = useMemo(() => {
    if(receipts.length === 0) {
      return null;
    }
    const received = receipts.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.RECEIVED);
    const processed = receipts.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSED);
    const processing = receipts.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSING);
    const failed = receipts.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.FAILED);

    return {
      [EReceiptProcessingStatus.RECEIVED]: received,
      [EReceiptProcessingStatus.PROCESSED]: processed,
      [EReceiptProcessingStatus.PROCESSING]: processing,
      [EReceiptProcessingStatus.FAILED]: failed
    };
  }, [receipts]);

  const list = useMemo(() => {
    if(!receiptsList) {
      return [];
    }
    return receiptsList[type] || [];
  }, [type, receiptsList]);

  useEffect(() => {
    console.log('Fetching list of receipts...');
    fetchData();
  } ,[]);

  useEffect(() => {
    if(refresh) {
      setRefreshList(refresh);
      refreshData();
    }
  } ,[refreshData, refresh]);

  const confirmReceipt = useCallback( async (receipt: TReceiptConfirm) => {
    const response = await HttpClient.post<{ payment: TPayment }>({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: receipt }
    })

    if(response.isOk) {
      showAlert({ message: 'finance.receipt.confirm.success', variant: 'success' });
      await fetchData();
      return;
    }

    showAlert({ message: 'finance.receipt.confirm.error', variant: 'error' });

  }, [showAlert, fetchData]);

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
    const updatedReceipts = receipts.map(receipt => {
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
  }, [closeModal, receipts]);

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

      {!receipts || receipts.length === 0 && (
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