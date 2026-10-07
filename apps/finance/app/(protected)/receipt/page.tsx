'use client';
import { useCallback ,useEffect } from 'react';

import { Text } from '@machado-repo/ui';

import {
  ReceiptBatch ,
  ReceiptInfo ,
} from '@/app/modules/finance/receipt';
import useReceipts from '@/app/modules/finance/receipt/hooks/useReceipts';
import { useCategory } from '@/app/modules/finance/category';

export default function HomeRouterPage() {

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
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-8xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            {`finance.receipt.title`}
          </Text>

          <Text className="max-w-2xl text-slate-600">
            finance.receipt.subtitle
          </Text>

        </div>

        { receipts.length > 0 && (<ReceiptInfo receipts={ receipts } categories={ categories } onCallback={ handleOnCallback }/>) }
        <ReceiptBatch onCallback={ handleOnCallback }/>
      </div>
    </main>
  );
}