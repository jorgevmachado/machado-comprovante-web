'use client';
import { useEffect } from 'react';
import { Filters ,Pagination ,Table ,Text } from '@machado-repo/ui';

import { useInstitution } from '@/app/modules/finance/institution';

type InstitutionListProps = {
  type: 'source' | 'destination';
}

export default function InstitutionList({
  type,
}: InstitutionListProps) {

  const { items, meta, fetchList, goToPage, isLoading } = useInstitution();

  useEffect(() => {
    void fetchList({institution_type: type});
  } ,[fetchList, type]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">{`finance.institution.${type}.title`}</Text>
            <Text>{`finance.institution.${type}.subtitle`}</Text>
          </div>
        </header>

        <Filters
          filters={[{ name: 'name', type: 'text', value: '' }]}
          onApply={(nextFilters) => fetchList({...nextFilters, institution_type: type})}
        />

        { !isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Text>{`finance.institution.${type}.empty`}</Text>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <Table items={items} headers={[
            { value: 'id', label: 'ID'},
            { value: 'name', label: `finance.institution.${type}.name.label`, sortable: true},
          ]}/>
        )}

        {meta && (
          <Pagination
            isLoading={isLoading}
            totalPages={meta.total_pages}
            currentPage={meta.current_page}
            onPageChange={(page) => goToPage(page, { institution_type: type })}
          />
        )}
      </div>
    </main>
  );
}