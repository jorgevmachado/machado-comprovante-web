'use client';
import { useCallback ,useEffect ,useState } from 'react';

import { Text ,useLoading ,useUser } from '@machado-repo/ui';

import type { TUser } from '@/app/modules/auth';

import {
  paymentService ,
  PaymentsInfo ,
  type PaymentsInfoResponse ,
} from '@/app/modules/finance/payment';

import {
  ReceiptBatch ,
  ReceiptInfo ,
  receiptService ,
  TReceipt ,
} from '@/app/modules/finance/receipt';

export default function HomeRouterPage() {
  const { user } = useUser<TUser>();
  const { execute } = useLoading();

  const [paymentsInfo ,setPaymentsInfo] = useState<PaymentsInfoResponse | undefined>(
    undefined);
  const [receipts ,setReceipts] = useState<Array<TReceipt>>([]);

  const fetchPaymentsInfo = useCallback(async () => {
    await execute(async () => {
      const response = await paymentService.info();
      const instance = response.instance;
      if (instance.errors.length) {
        console.error('Errors fetching payments info:' ,instance.errors);
      }
      setPaymentsInfo(instance);
    });

  } ,[execute]);

  const fetchReceipts = useCallback(async () => {
    await execute(async () => {
      const response = await receiptService.getReceipts();
      if (response.isFailure) {
        return;
      }
      setReceipts(response.instance);
    })
  } ,[execute]);

  const handleOnCallback = useCallback(async (status: 'error' | 'success') => {
    if (status === 'success') {
      await fetchReceipts();
      await fetchPaymentsInfo();
    }
  } ,[fetchPaymentsInfo ,fetchReceipts]);

  useEffect(() => {
    fetchPaymentsInfo();
    fetchReceipts();
  } ,[]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            {`finance.welcome.title, {name: ${user?.name}}`}
          </Text>

          <Text className="max-w-2xl text-slate-600">
            finance.welcome.subtitle
          </Text>
        </div>

        { paymentsInfo && (<PaymentsInfo info={paymentsInfo}/>) }
        { receipts.length > 0 && (<ReceiptInfo receipts={ receipts } onCallback={ handleOnCallback }/>) }
        <ReceiptBatch onCallback={ handleOnCallback }/>
      </div>
    </main>
  );
}