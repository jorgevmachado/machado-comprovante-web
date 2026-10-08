'use client';

import { useEffect } from 'react';

import { Filters ,Pagination ,Table ,Text ,useModal } from '@machado-repo/ui';

import { BeneficiaryForm } from '../components';
import { useBeneficiary } from '../hooks';

import {
  TBeneficiary ,
  TBeneficiaryPersist,
} from '@/src/features/beneficiary/types';

export default function BeneficiaryPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, goToPage, fetchList, items, isLoading, persist } = useBeneficiary();

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  const handlePersistPayer = async (item: TBeneficiaryPersist) => {
    await persist(item);
    closeModal();
  };

  const handleOpenFormModal = (item?: TBeneficiary) => {
    openModal({
      title: item?.id
        ? `finance.beneficiary.edit.title, {name: ${item.name}}`
        : 'finance.beneficiary.create.title',
      children: (
        <BeneficiaryForm item={item} onSubmit={handlePersistPayer} onCancel={closeModal} />
      ),
    });
  };

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Text weight="bold" size="3xl">finance.beneficiary.title</Text>
          <Text className="mt-1 text-slate-600">finance.beneficiary.subtitle</Text>
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
              <Text color="text-slate-600">finance.beneficiary.empty</Text>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto rounded-2xl">
              <Table
                items={items}
                headers={[
                  { value: 'id', label: 'ID' },
                  { value: 'name', label: 'finance.beneficiary.name.label', sortable: true },
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
          {modal}
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
      </div>
    </main>
  );
}
