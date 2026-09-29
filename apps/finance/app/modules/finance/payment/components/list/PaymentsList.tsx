'use client';
import { DateVO ,Money } from '@machado-repo/shared';

import { Table ,Text ,useUI } from '@machado-repo/ui';

import type { TPayment } from '@/app/modules/finance/payment';

type PaymentsListProps = {
  title?: string;
  payments: Array<TPayment>;
}

export default function PaymentsList({
  title = 'finance.payment.info.title',
  payments
}: PaymentsListProps) {
  const { locale } = useUI();

  if(payments.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Text>No payments found.</Text>
      </div>
    );
  }

  return (
    <div>
      {title && (<Text>{title}</Text>)}
      <Table
        items={payments}
        headers={[
          {value: 'payment_date', label: 'finance.payment.date.label', format: (value) => DateVO.formatDate(new Date(value), locale)},
          {value: 'beneficiary', label: 'finance.beneficiary.name.label', format: (value) => value.name},
          {value: 'amount', label: 'finance.payment.amount.label', format: (value) => Money.tryCreate(value).instance.formatted},
        ]}/>
    </div>
  )
}