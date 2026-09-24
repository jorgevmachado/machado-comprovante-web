import { useCallback ,useEffect ,useMemo ,useState } from 'react';
import { HttpClient } from '@machado-repo/shared';
import { Text ,useAlert ,useLoading ,useModal } from '@machado-repo/ui';

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
  const { execute } = useLoading();
  const [receiptsState, setReceipts] = useState<Array<TReceipt>>(receipts);

  const receiptsList = useMemo(() => {
    if(receiptsState.length === 0) {
      setReceipts(receipts);
    }

    const state = receiptsState.length === 0 ? receipts : receiptsState;

    if(state.length === 0) {
      return null;
    }
    const received = state.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.RECEIVED);
    const processed = state.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSED);
    const processing = state.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.PROCESSING);
    const failed = state.filter((receipt) => receipt.processing_status === EReceiptProcessingStatus.FAILED);

    return {
      [EReceiptProcessingStatus.RECEIVED]: received,
      [EReceiptProcessingStatus.PROCESSED]: processed,
      [EReceiptProcessingStatus.PROCESSING]: processing,
      [EReceiptProcessingStatus.FAILED]: failed
    };
  }, [receipts, receiptsState]);

  useEffect(() => {
    if(receiptsState.length === 0 && receipts.length > 0) {
      setReceipts(receipts);
    }
  } ,[receipts, receiptsState.length]);

  const confirmReceipt = useCallback( async (receipt: TReceiptConfirm) => {
    return await execute(async () => {
      const response = await HttpClient.post<{ payment: TPayment }>({
        path: '/receipt/confirm',
        baseUrl: '/api',
        config: { body: receipt }
      })

      const variant = response.isOk ? 'success' : 'error';
      showAlert({ message: `finance.receipt.confirm.${variant}`, variant });
      onCallback?.(variant);
      if(response.isOk) {
        const receiptsToUpdate = receiptsState.map((r) => {
          if(r.id === receipt.id) {
            return {
              ...r,
              processing_status: EReceiptProcessingStatus.PROCESSED
            }
          }
          return r;
        });
        setReceipts(receiptsToUpdate);
      }
      return response;
    })
  }, [execute, showAlert, onCallback, receiptsState]);

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

  const updateReceipts = useCallback( async (dataItem: TReceiptConfirm, data: TReceiptData, isPersist: boolean = false) => {
    return await execute(async () => {
      if(!isPersist) {
        return {
          id: dataItem.id,
          data: data,
          status: EReceiptProcessingStatus.RECEIVED
        }
      }
      const response = await HttpClient.put<TReceipt>({
        path: '/receipt',
        baseUrl: '/api',
        config: { body: dataItem }
      });
      const variant = response.isOk ? 'success' : 'error';
      showAlert({ message: `finance.receipt.update.${variant}`, variant });
      onCallback?.(variant);
      if(!response.isOk || !response.instance) {
        return;
      }
      const receipt = response.instance;
      return {
        id: receipt.id,
        data: receipt.extracted_data,
        status: receipt.processing_status
      }
    });
  }, [execute, onCallback, showAlert]);


  const updateReceiptList = useCallback(async (dataItem: TReceiptConfirm, data: TReceiptData, isPersist: boolean = false) => {
    const receiptToUpdateList = await updateReceipts(dataItem, data, isPersist)
    if(!receiptToUpdateList) {
      return;
    }
    const updatedReceipts = receiptsState.map(receipt => {
      if(receipt.id === receiptToUpdateList.id) {
        return {
          ...receipt,
          extracted_data: receiptToUpdateList.data,
          processing_status: receiptToUpdateList.status
        }
      }
      return receipt;
    })
    setReceipts(updatedReceipts);
    closeModal();
  }, [closeModal, receiptsState, updateReceipts]);

  const handleOpenFormModal = (item: TReceiptConfirm, isPersist?: boolean) => {
    openModal({
      title: 'finance.receipt.edit.title',
      children: (
        <ReceiptInfoConfirm
          item={item}
          onSubmit={(dataItem, data) => updateReceiptList(dataItem, data, isPersist)}
          onCancel={() => closeModal()}
        />
      ),
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

      {receiptsList && receiptsList[EReceiptProcessingStatus.RECEIVED] && receiptsList[EReceiptProcessingStatus.RECEIVED].length > 0 && (
        <ReceiptInfoList
          receipts={receiptsList[EReceiptProcessingStatus.RECEIVED]}
          onEdit={handleOpenFormModal}
          onShow={handleOpenShowModal}
          onConfirm={handleOpenConfirmReceiptModal}
          className="mt-6"
        />
      )}

      {receiptsList && receiptsList[EReceiptProcessingStatus.FAILED] && receiptsList[EReceiptProcessingStatus.FAILED].length > 0 && (
        <ReceiptInfoList
          receipts={receiptsList[EReceiptProcessingStatus.FAILED]}
          onEdit={(item) => handleOpenFormModal(item, true)}
          onShow={handleOpenShowModal}
          className="mt-6"
        />
      )}

      {receiptsList && receiptsList[EReceiptProcessingStatus.PROCESSING] && receiptsList[EReceiptProcessingStatus.PROCESSING].length > 0 && (
        <ReceiptInfoList
          receipts={receiptsList[EReceiptProcessingStatus.PROCESSING]}
          className="mt-6"
        />
      )}
      {modal}
    </div>
  )
}