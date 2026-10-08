import { useMemo } from 'react';

import { DateVO ,Money } from '@machado-repo/shared';

import { Table ,TableProps ,Text ,useUI } from '@machado-repo/ui';

import type { TPayment } from '../../types';

type PaymentsListProps = {
  onEdit?: (item: TPayment) => void;
  resumed?: boolean;
  payments: Array<TPayment>;
  isLoading: boolean;
}

export default function PaymentsList({
  onEdit,
  resumed = true,
  payments,
  isLoading
}: PaymentsListProps) {
  const { locale } = useUI();

  const tableHeader: TableProps<TPayment>['headers'] = useMemo(() => {
    if(resumed) {
      return [
        {value: 'payment_date', label: 'finance.payment.date.label', format: (value) => DateVO.format.date(value, locale)},
        {value: 'beneficiary', label: 'finance.beneficiary.name.label', format: (value) => value.name},
        {value: 'amount', label: 'finance.payment.amount.label', format: (value) => Money.tryCreate(value).instance.formatted},
      ]
    }
    return [
      {value: 'receipt', label: 'finance.receipt.payer.label', sortable: true, format: (value) => value.payer ?? '--'},
      {value: 'category', label: 'finance.category.name.label', sortable: true, format: (value) => value.name},
      {value: 'beneficiary', label: 'finance.beneficiary.name.label', sortable: true,format: (value) => value.name},
      {value: 'amount', label: 'finance.payment.amount.label', sortable: true, format: (value) => Money.tryCreate(value, { locale }).instance.formatted},
      {value: 'source_institution', label: 'finance.payment.source_institution.label', format: (value) => value.name},
      {value: 'destination_institution', label: 'finance.payment.destination_institution.label', format: (value) => value?.name ?? '--'},
      {value: 'payment_date', label: 'finance.payment.date.label', format: (value) => DateVO.format.date(value, locale)},
    ]
  }, [locale, resumed]);

  const tableActions: TableProps<TPayment>['actions'] = useMemo(() => {
    if(resumed || !onEdit) {
      return undefined;
    }
    return {
      text: 'form.action.actions',
      icons: [{
        icon: 'edit',
        onClick: onEdit
      }]
    };
  }, [resumed, onEdit]);

  const classNameList = useMemo(() => {
    if(!resumed) {
      return undefined;
    }
    return 'mx-auto flex w-full max-w-7xl flex-col gap-6';
  }, [resumed]);

  return (
    <div className={classNameList}>
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
          <Text color="text-slate-600">common.loading</Text>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center shadow-sm">
          <Text color="text-slate-600">finance.payment.empty</Text>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-2xl">
          <Table
            items={payments}
            headers={tableHeader}
            actions={tableActions}
          />
        </div>
      )}
    </div>
  )
}