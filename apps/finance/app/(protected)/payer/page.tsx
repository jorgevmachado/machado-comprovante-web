'use client';
import {
  Button ,
  Filters ,
  Pagination ,
  Table ,
  Text ,
  useModal,
} from '@machado-repo/ui';
import { TPayer ,TPayerPersist ,usePayer } from '@/app/modules/finance/payer';
import { useEffect } from 'react';
import PayerForm from '../../modules/finance/payer/components/form';

export default function PayerRouterPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, goToPage, fetchList, items, isLoading, persist } = usePayer();

  useEffect(() => {
    void fetchList({ page: '1' });
  } ,[fetchList]);

  const handlePersistPayer = async (item: TPayerPersist) => {
    await persist(item);
    closeModal()
  }

  const handleOpenFormModal = (item?: TPayer) => {

    openModal({
      title: item?.id
        ? `finance.payer.edit.title, {name: ${item.name}}`
        : 'finance.payer.create.title',
      children: (
        <PayerForm item={item} onSubmit={handlePersistPayer} onCancel={closeModal} />
      )
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">finance.payer.title</Text>
            <Text>finance.payer.subtitle</Text>
          </div>
          <div>
            <Button onClick={() => handleOpenFormModal()} tone="success">finance.payer.create.title</Button>
          </div>
        </header>

        <Filters
          filters={[{ name: 'name', type: 'text', value: '' }]}
          onApply={(nextFilters) => fetchList(nextFilters)}
        />

        { !isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Text>finance.payer.empty</Text>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <Table
            items={items}
            headers={[{ value: 'id', label: 'ID'},{ value: 'name', label: 'finance.payer.name.label', sortable: true}]}
            actions={{
              text: 'form.action.actions',
              icons: [{
                icon: 'edit',
                onClick: handleOpenFormModal
              }]
            }}
          />
        )}
        {modal}
        {meta && (
          <Pagination
            isLoading={isLoading}
            totalPages={meta.total_pages}
            currentPage={meta.current_page}
            onPageChange={(page) => goToPage(page)}
          />
        )}
      </div>
    </main>
  );
}