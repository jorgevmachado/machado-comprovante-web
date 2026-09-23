'use client';
import { useMemo } from 'react';

import { Money } from '@machado-repo/shared';
import { useUI, Text } from '@machado-repo/ui';

type PaymentsTotalProps = {
  title?: string;
  total: number;
}
export default function PaymentsTotal({
  total,
  title = 'finance.payment.total.title',
}: PaymentsTotalProps) {
  const { locale } = useUI();

  const totalFormatted = useMemo(() => {
    const value = Money.tryCreate(total, { locale });
    if(value.isFailure){
      return Money.tryCreate(0, { locale }).instance.formatted;
    }
    return value.instance.formatted;
  } ,[locale, total]);

  return (
    <div id="payments-total" className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <Text as="h3">{title}</Text>
      <Text>{totalFormatted}</Text>
    </div>
  )
}