'use client';
import { Money } from '@machado-repo/shared';

import { Table ,Text } from '@machado-repo/ui';

import type { TPayment } from '@/app/modules/finance/payment';

type PaymentsListProps = {
  title?: string;
  payments: Array<TPayment>;
}

export default function PaymentsList({
  title = 'finance.payment.info.title',
  payments
}: PaymentsListProps) {

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
          {value: 'payment_date', label: 'Payment Date', format: (value) => new Date(value).toLocaleDateString()},
          {value: 'beneficiary', label: 'Beneficiary Name', format: (value) => value.name},
          {value: 'amount', label: 'Amount', format: (value) => Money.tryCreate(value).instance.formatted},
        ]}/>
    </div>
  )
}