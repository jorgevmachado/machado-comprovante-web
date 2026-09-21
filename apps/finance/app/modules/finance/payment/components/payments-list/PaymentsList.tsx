'use client';
import { useEffect ,useState } from 'react';
import { HttpClient ,Money } from '@machado-repo/shared';

import { Table ,Text } from '@machado-repo/ui';

import type { TPayment ,TPaymentFilter } from '@/app/modules/finance/payment';

type PaymentsListProps = {
  title?: string;
  filters?: TPaymentFilter;
}

export default function PaymentsList({
  title,
  filters
}: PaymentsListProps) {
  const [payments, setPayments] = useState<Array<TPayment>>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await HttpClient.get<Array<TPayment>>({
        path: '/payment',
        baseUrl: '/api',
        config: { params: filters }
      })
      if(response.isOk) {
        setPayments(response.instance);
      }
    }
    fetchPayments();
  } ,[filters]);

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