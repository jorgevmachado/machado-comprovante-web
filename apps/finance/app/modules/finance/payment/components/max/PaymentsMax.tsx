'use client';
import { useMemo} from 'react';
import { Money } from '@machado-repo/shared';
import { Text ,useUI } from '@machado-repo/ui';

type PaymentsMaxProps = {
  title?: string;
  maxValue: number;
}
export default function PaymentsMax({
  title = 'finance.payment.max.title',
  maxValue
}: PaymentsMaxProps) {
  const { locale } = useUI();

  const totalFormatted = useMemo(() => {
    const value = Money.tryCreate(maxValue, { locale });
    if(value.isFailure){
      return Money.tryCreate(0, { locale }).instance.formatted;
    }
    return value.instance.formatted;
  } ,[locale, maxValue]);

  return (
    <div id="payments-max" className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <Text as="h3">{title}</Text>
      <Text>{totalFormatted}</Text>
    </div>
  )
}