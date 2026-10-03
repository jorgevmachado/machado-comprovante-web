'use client';
import { useCallback ,useEffect } from 'react';

import { Autocomplete ,Select ,Text ,useUser } from '@machado-repo/ui';

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
import { useCategory } from '@/app/modules/finance/category';

export default function HomeRouterPage() {
  const { user } = useUser<TUser>();
  const {
    fetchInfo: fetchPaymentsInfo,
    payments,
    isLoading: isLoadingPayments,
    maxPayment,
    totalAmount,
    paymentCount,
  } = usePayments();

  const {
    receipts,
    getReceipts: fetchReceipts,
  } = useReceipts();

  const {
    fetchList: fetchCategories,
    items: categories,
  } = useCategory()

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchCategories(),
      fetchReceipts(),
      fetchPaymentsInfo(),
    ]);
  }, [fetchCategories, fetchPaymentsInfo, fetchReceipts]);

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
      <div className="mx-auto flex max-w-8xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            {`finance.welcome.title, {name: ${user?.name}}`}
          </Text>

          <Text className="max-w-2xl text-slate-600">
            finance.welcome.subtitle
          </Text>

          <Select name="example" options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]} onChange={(value) => console.log('SELECT => value => ', value)} />

          <Autocomplete name="example" options={[
            { key: '1', value: 'option1', label: 'Option 1' },
            { key: '2', value: 'option2', label: 'Option 2' },
            { key: '3', value: 'option3', label: 'Option 3' },
          ]} onChange={(value) => console.log('AUTOCOMPLETE => value => ', value)} />

        </div>

        <PaymentsInfo
          payments={payments}
          isLoading={isLoadingPayments}
          maxPayment={maxPayment}
          totalAmount={totalAmount}
          paymentCount={paymentCount}
        />
        { receipts.length > 0 && (<ReceiptInfo receipts={ receipts } categories={ categories } onCallback={ handleOnCallback }/>) }
        <ReceiptBatch onCallback={ handleOnCallback }/>
      </div>
    </main>
  );
}