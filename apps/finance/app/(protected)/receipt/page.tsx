'use client';
import { useCallback ,useEffect } from 'react';

import { Text } from '@machado-repo/ui';

import {
  ReceiptBatch ,
  ReceiptInfo ,
} from '@/src/features/receipt';
import useReceipts from '@/src/features/receipt/hooks/useReceipts';
import { useCategory } from '@/src/features/category';

export default function ReceiptRouterPage() {

  const {
    receipts,
    getReceipts: fetchReceipts,
  } = useReceipts();

  const { categories } = useCategory();

  const handleOnCallback = useCallback(async (status: 'error' | 'success') => {
    if (status !== 'success') {
      return;
    }
    await fetchReceipts();
  } ,[fetchReceipts]);

  useEffect(() => {
    void fetchReceipts();
  }, [fetchReceipts]);

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Text as="h1" weight="bold" size="3xl">
            {`finance.receipt.title`}
          </Text>
          <Text className="mt-1 max-w-2xl text-slate-600">
            finance.receipt.subtitle
          </Text>
        </header>

        {receipts.length > 0 && (
          <ReceiptInfo
            receipts={receipts}
            categories={categories}
            onCallback={handleOnCallback}
          />
        )}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <ReceiptBatch onCallback={handleOnCallback} />
        </section>
      </div>
    </main>
  );
}