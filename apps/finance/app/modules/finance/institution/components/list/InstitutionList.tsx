'use client';
import { Table ,Text } from '@machado-repo/ui';

import type { TInstitution } from '@/app/modules/finance/institution';

type InstitutionListProps = {
  type: 'source' | 'destination';
  isLoading?: boolean;
  institutions: Array<TInstitution>;
}

export default function InstitutionList({
  type,
  isLoading = false,
  institutions,
}: InstitutionListProps) {

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">{`finance.institution.${type}.title`}</Text>
            <Text>{`finance.institution.${type}.subtitle`}</Text>
          </div>
        </header>

        { !isLoading && institutions.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Text>{`finance.institution.${type}.empty`}</Text>
          </div>
        )}

        {!isLoading && institutions.length > 0 && (
          <Table items={institutions} headers={[
            { value: 'id', label: 'ID'},
            { value: 'name', label: `finance.institution.${type}.name.label`, sortable: true},
          ]}/>
        )}
      </div>
    </main>
  );
}