import { useAlert ,useLoading, type TAlertActionOptions } from '@machado-repo/ui';
import { useCallback ,useState } from 'react';
import {
  receiptService ,
  TReceipt ,TReceiptBatch ,TReceiptConfirm ,
  TReceiptFilter ,
} from '@/app/modules/finance/receipt';

type UseReceiptActionOptions = TAlertActionOptions;

type UseReceiptsReturn = {
  receipts: Array<TReceipt>;
  getReceipts: (params?: TReceiptFilter, options?: TAlertActionOptions) => Promise<void>;
  receiptBatch?: TReceiptBatch;
  updateReceipt: (receipt: TReceiptConfirm, options?: TAlertActionOptions) => Promise<TReceipt | undefined>;
  confirmReceipt: (receipt: TReceiptConfirm, options?: TAlertActionOptions) => Promise<boolean>;
  receiptBatchUpload: (files: Array<File>, options?: TAlertActionOptions) => Promise<void>;
}

const messagePrefix = 'finance.receipt';

export default function useReceipts(): UseReceiptsReturn {
  const { execute } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [receipts ,setReceipts] = useState<Array<TReceipt>>([]);
  const [receiptBatch, setReceiptBatch] = useState<TReceiptBatch | undefined>(undefined);


  const getReceipts = useCallback(async (params?: TReceiptFilter, options?: UseReceiptActionOptions) => {
    await execute(async () => {
      const response = await receiptService.getReceipts(params);
      const instance = response.instance ?? [];
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setReceipts(instance);
    });
  }, [execute, executeServiceAlert]);

  const receiptBatchUpload = useCallback(async (files: Array<File>, options?: UseReceiptActionOptions) => {

    await execute(async () => {
      const response = await receiptService.receiptBatch(files);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'batch',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setReceiptBatch(response.instance);
    });
  }, [execute, executeServiceAlert]);

  const confirmReceipt = useCallback(async (receipt: TReceiptConfirm, options?: UseReceiptActionOptions) => {
    return await execute(async () => {
      const response = await receiptService.confirmReceipt(receipt);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'confirm',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      return response.isOk;
    });
  },[execute, executeServiceAlert]);

  const updateReceipt = useCallback(async (receipt: TReceiptConfirm, options?: UseReceiptActionOptions) => {
    return await execute(async () => {
      const response = await receiptService.updateReceipt(receipt);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      return response.instance;
    });
  },[execute, executeServiceAlert]);

  return {
    receipts,
    getReceipts,
    receiptBatch,
    updateReceipt,
    confirmReceipt,
    receiptBatchUpload,
  };
}