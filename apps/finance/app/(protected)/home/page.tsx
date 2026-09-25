'use client';
import { useCallback ,useEffect } from 'react';

import { Text ,useUser } from '@machado-repo/ui';

import type { TUser } from '@/app/modules/auth';

import {
  PaymentsInfo ,
  usePayments
} from '@/app/modules/finance/payment';

import {
  ReceiptBatch ,
  ReceiptInfo ,
} from '@/app/modules/finance/receipt';
import useReceipts from '@/app/modules/finance/receipt/hooks/useReceipts';

export default function HomeRouterPage() {
  const { user } = useUser<TUser>();
  const {
    fetchInfo: fetchPaymentsInfo,
    payments,
    maxPayment,
    totalAmount,
    paymentCount,
  } = usePayments();

  const {
    receipts,
    getReceipts: fetchReceipts,
  } = useReceipts();

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchReceipts(),
      fetchPaymentsInfo(),
    ]);
  }, [fetchPaymentsInfo, fetchReceipts]);

  const handleOnCallback = useCallback(async (status: 'error' | 'success') => {
    if (status !== 'success') {
      return;
    }
    await refreshData();
  } ,[refreshData]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

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

        <PaymentsInfo
          payments={payments}
          maxPayment={maxPayment}
          totalAmount={totalAmount}
          paymentCount={paymentCount}
        />
        { receipts.length > 0 && (<ReceiptInfo receipts={ receipts } onCallback={ handleOnCallback }/>) }
        <ReceiptBatch onCallback={ handleOnCallback }/>
      </div>
    </main>
  );
}