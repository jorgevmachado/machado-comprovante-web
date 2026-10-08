'use client';

import { useEffect } from 'react';

import {
  Button,
  Filters,
  Pagination,
  Table,
  Text,
  useModal,
} from '@machado-repo/ui';

import { PayerForm } from '../components';
import { usePayer } from '../hooks';
import type { TPayer, TPayerPersist } from '../types';

export default function PayerPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, goToPage, fetchList, items, isLoading, persist } = usePayer();

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  const handlePersistPayer = async (item: TPayerPersist) => {
    await persist(item);
    closeModal();
  };

  const handleOpenFormModal = (item?: TPayer) => {
    openModal({
      title: item?.id
        ? `finance.payer.edit.title, {name: ${item.name}}`
        : 'finance.payer.create.title',
      children: (
        <PayerForm item={item} onSubmit={handlePersistPayer} onCancel={closeModal} />
      ),
    });
  };

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <Text weight="bold" size="3xl">finance.payer.title</Text>
            <Text className="mt-1 text-slate-600">finance.payer.subtitle</Text>
          </div>
          <div className="w-full shrink-0 sm:w-auto">
            <Button
              className="w-full sm:w-auto"
              onClick={() => handleOpenFormModal()}
              tone="success"
            >
              finance.payer.create.title
            </Button>
          </div>
        </header>

        <Filters
          filters={[{ name: 'name', type: 'text', value: '' }]}
          onApply={(nextFilters) => fetchList(nextFilters)}
        />

        <section aria-live="polite" className="min-w-0">
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
              <Text color="text-slate-600">common.loading</Text>
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center shadow-sm">
              <Text color="text-slate-600">finance.payer.empty</Text>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto rounded-2xl">
              <Table
                items={items}
                headers={[
                  { value: 'id', label: 'ID' },
                  { value: 'name', label: 'finance.payer.name.label', sortable: true },
                ]}
                actions={{
                  text: 'form.action.actions',
                  icons: [{
                    icon: 'edit',
                    onClick: handleOpenFormModal,
                  }],
                }}
              />
            </div>
          )}

          {meta && (
            <div className="mt-5 sm:mt-6">
              <Pagination
                isLoading={isLoading}
                totalPages={meta.total_pages}
                currentPage={meta.current_page}
                onPageChange={(page) => goToPage(page)}
              />
            </div>
          )}
        </section>
        {modal}
      </div>
    </main>
  );
}
