import {
  TReceiptBatch ,
  TReceiptConfirm ,
  EReceiptProcessingStatus ,
} from '@/app/modules/finance/receipt';
import { useCallback ,useEffect ,useMemo ,useState } from 'react';
import { Table ,useAlert, Text } from '@machado-repo/ui';
import { HttpClient ,Money } from '@machado-repo/shared';
import { TPayment } from '@/app/modules/finance';

type ReceiptStatusInfo = { status: EReceiptProcessingStatus; total: number; }

type ReceiptStatusKey =
  | 'failed'
  | 'received'
  | 'processed'
  | 'processing';

type ReceiptValidateProps = {
  receiptBatch: TReceiptBatch;
}

export default function ReceiptValidate({ receiptBatch }: ReceiptValidateProps) {
  const { showAlert } = useAlert();
  const initializeReceivedToConfirm = useCallback((receiptBatch: TReceiptBatch) => {
    const result: Array<TReceiptConfirm> = [];
    receiptBatch.items.forEach((item) => {
      if(item.processing_status === 'RECEIVED' && item.errors.length === 0 && item.data) {
        const data = item.data;

        if (!data.beneficiary || !data.beneficiary.value) {
          return;
        }

        if (!data.payment_date || !data.payment_date.value) {
          return;
        }

        if (!data.source_institution || !data.source_institution.value) {
          return;
        }

        result.push({
          id: item.id,
          fine: data.fine.value,
          payer: data.payer.value ?? '--',
          barcode: data.barcode.value,
          due_date: data.due_date.value,
          discount: data.discount.value,
          interest: data.interest.value,
          paid_amount: data.paid_amount.value ?? 0,
          beneficiary: data.beneficiary.value,
          payment_date: data.payment_date.value,
          total_charges: data.total_charges.value,
          authentication: data.authentication.value,
          transaction_id: data.transaction_id.value,
          effective_payer: data.effective_payer.value,
          document_amount: data.document_amount.value,
          source_institution: data.source_institution.value,
          destination_institution: data.destination_institution.value ?? '--',
        })
      }
    })
    return result;
  }, [])

  const initializeReceiptStatusInfo = useCallback((receiptBatch: TReceiptBatch) => {
    const result: Array<ReceiptStatusInfo> = [];
    result.push({ status: EReceiptProcessingStatus.RECEIVED, total: receiptBatch.received });
    result.push({ status: EReceiptProcessingStatus.PROCESSING, total: receiptBatch.processing });
    result.push({ status: EReceiptProcessingStatus.PROCESSED, total: receiptBatch.processed });
    result.push({ status: EReceiptProcessingStatus.FAILED, total: receiptBatch.failed });
    return result;
  }, []);

  const [receivedToConfirm, setReceivedToConfirm] = useState<Array<TReceiptConfirm>>(initializeReceivedToConfirm(receiptBatch));
  const [receiptStatusInfo, setReceiptStatusInfo] = useState<Array<ReceiptStatusInfo>>(initializeReceiptStatusInfo(receiptBatch));

  const updatedReceiptStatusInfo = useCallback((
    origin: EReceiptProcessingStatus,
    destiny: EReceiptProcessingStatus,
  ) => {
    const currentReceiptBath = {...receiptBatch};
    const receiptOrigin = origin.toLowerCase() as ReceiptStatusKey;
    const receiptDestiny = destiny.toLowerCase() as ReceiptStatusKey;
    currentReceiptBath[receiptOrigin] = currentReceiptBath[receiptOrigin] - 1
    currentReceiptBath[receiptDestiny] = currentReceiptBath[receiptDestiny] + 1
    const updatedInfo = initializeReceiptStatusInfo(currentReceiptBath);
    setReceiptStatusInfo(updatedInfo);
  }, [initializeReceiptStatusInfo, receiptBatch])

  const confirmReceipt = useCallback( async (receipt: TReceiptConfirm) => {
    const response = await HttpClient.post<{ payment: TPayment }>({
      path: '/receipt/confirm',
      baseUrl: '/api',
      config: { body: receipt }
    })

    const updatedReceivedToConfirm = receivedToConfirm.filter(item => item.id !== receipt.id);
    setReceivedToConfirm(updatedReceivedToConfirm);

    if(response.isOk) {
      showAlert({ message: 'Receipt confirmed successfully', variant: 'success' });
      updatedReceiptStatusInfo(EReceiptProcessingStatus.RECEIVED, EReceiptProcessingStatus.PROCESSED);
      return;
    }

    updatedReceiptStatusInfo(EReceiptProcessingStatus.RECEIVED, EReceiptProcessingStatus.FAILED);

    showAlert({ message: 'Failed to confirm receipt', variant: 'error' });

  }, [receivedToConfirm, showAlert, updatedReceiptStatusInfo]);

  return (
    <div>
      <div className="flex flex-row gap-6">
        {receiptStatusInfo.map((item) => (
          <div key={item.status} id={item.status} className="flex-1 overflow-hidden transition-all p-4  rounded-2xl bg-white shadow-md border border-slate-200">
            <h3>{item.status}</h3>
            <p>{item.total}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Text>Received</Text>
        <Table
          items={receivedToConfirm}
          headers={[
            { value: 'payer', label: 'Payer' },
            { value: 'beneficiary', label: 'Beneficiary' },
            { value: 'payment_date', label: 'Payment Date', format: (value) => value.toLocaleDateString() },
            { value: 'source_institution', label: 'Source Institution' },
            { value: 'destination_institution', label: 'Destination Institution' },
            { value: 'paid_amount', label: 'Paid Amount', format: (value) => Money.tryCreate(value).instance.formatted },
          ]}
          actions={{
            text: 'form.action.actions' ,
            icons: [
              {
                icon: 'edit' ,onClick: (item) => {
                  console.log('Editar:' ,item);
                } ,
              },
              {
                icon: 'confirm' ,onClick: confirmReceipt ,
              }
            ]
          }}
        />
      </div>
    </div>
  )
}