import { useMemo } from 'react';

import { DateVO ,Money } from '@machado-repo/shared';

import { Table ,TableProps ,Text ,useUI } from '@machado-repo/ui';

import type { TPayment } from '@/app/modules/finance/payment';

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
      {value: 'receipt', label: 'finance.receipt.payer.label', format: (value) => value.payer ?? '--'},
      {value: 'beneficiary', label: 'finance.beneficiary.name.label', format: (value) => value.name},
      {value: 'amount', label: 'finance.payment.amount.label', format: (value) => Money.tryCreate(value, { locale }).instance.formatted},
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
    <div className={ classNameList }>


      { !isLoading && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Text>{`finance.payment.empty`}</Text>
        </div>
      )}
      {!isLoading && payments.length > 0 && (
        <Table
          items={payments}
          headers={tableHeader}
          actions={tableActions}
        />
      )}
    </div>
  )
}