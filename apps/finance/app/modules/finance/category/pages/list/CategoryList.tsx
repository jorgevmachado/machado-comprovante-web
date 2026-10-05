'use client';
import { useEffect } from 'react';

import {
  Button ,
  Filters ,
  Pagination ,
  Table ,
  Text ,
  useModal,
} from '@machado-repo/ui';
import {
  CategoryForm ,
  TCategory ,
  TCategoryPersist ,
  useCategory ,
} from '@/app/modules/finance/category';


export default function CategoryListPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, goToPage, fetchList, items, isLoading, persist } = useCategory();

  useEffect(() => {
    void fetchList({ page: '1' });
  } ,[fetchList]);

  const handlePersistCategory = async (item: TCategoryPersist) => {
    await persist(item);
    closeModal();
  }

  const handleOpenFormModal = (item?: TCategory) => {
    openModal({
      title: item?.id
        ? `finance.category.edit.title, {name: ${item.name}`
        : 'finance.category.create.title',
      children: (
        <CategoryForm item={item} onSubmit={handlePersistCategory} onCancel={closeModal} />
      )
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">finance.category.title</Text>
            <Text>finance.category.subtitle</Text>
          </div>
          <div>
            <Button onClick={() => handleOpenFormModal()} tone="success">finance.category.create</Button>
          </div>
        </header>

        <Filters
          filters={[{ name: 'name', type: 'text', value: '' }]}
          onApply={(nextFilters) => fetchList(nextFilters)}
        />

        { !isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Text>finance.category.empty</Text>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <Table
            items={items}
            headers={[
              { value: 'id', label: 'ID'},
              { value: 'name', label: 'finance.category.name.label', sortable: true},
              { value: 'description', label: 'form.label.description'},
            ]}
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