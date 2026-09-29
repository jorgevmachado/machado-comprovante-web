'use client';
import { Filters ,Pagination ,Table ,Text } from '@machado-repo/ui';
import { useBeneficiary } from '@/app/modules/finance/beneficiary';
import { useEffect } from 'react';

export default function BeneficiaryRouterPage() {
  const { meta, goToPage, getBeneficiaries, beneficiaries, isLoading } = useBeneficiary();

  useEffect(() => {
    void getBeneficiaries({ page: '1' });
  } ,[getBeneficiaries]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">finance.beneficiary.title</Text>
            <Text>finance.beneficiary.subtitle</Text>
          </div>
        </header>

        <Filters
          filters={[{ name: 'name', type: 'text', value: '' }]}
          onApply={(nextFilters) => getBeneficiaries(nextFilters)}
        />

        { !isLoading && beneficiaries.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Text>finance.beneficiary.empty</Text>
          </div>
        )}

        {!isLoading && beneficiaries.length > 0 && (
          <Table items={beneficiaries} headers={[
            { value: 'id', label: 'ID'},
            { value: 'name', label: 'finance.beneficiary.name.label', sortable: true},
          ]}/>
        )}

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