'use client';
import { useCallback ,useEffect ,useState } from 'react';

import { Teste ,Text ,useUser } from '@machado-repo/ui';

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

  const [paymentsInfo ,setPaymentsInfo] = useState<PaymentsInfoResponse | undefined>(
    undefined);
  const [receipts ,setReceipts] = useState<Array<TReceipt>>([]);

  const fetchPaymentsInfo = useCallback(async () => {
    const response = await paymentService.info();
    const instance = response.instance;
    if (instance.errors.length) {
      console.error('Errors fetching payments info:' ,instance.errors);
    }
    setPaymentsInfo(instance);
  } ,[]);

  const fetchReceipts = useCallback(async () => {
    const response = await receiptService.getReceipts();
    if (response.isFailure) {
      return;
    }
    setReceipts(response.instance);
  } ,[]);

  const handleOnCallback = useCallback(async (status: 'error' | 'success') => {
    if (status === 'success') {
      await fetchPaymentsInfo();
      await fetchReceipts();
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
        <ReceiptInfo receipts={ receipts } onCallback={ handleOnCallback }/>
        <ReceiptBatch onCallback={ handleOnCallback }/>
      </div>
    </main>
  );
}