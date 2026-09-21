'use client';
import { useEffect ,useMemo ,useState } from 'react';
import { HttpClient ,Money } from '@machado-repo/shared';
import { useUI } from '@machado-repo/ui';

type PaymentsTotalProps = {
  title?: string;
  endDate?: Date;
  startDate?: Date;
}
export default function PaymentsTotal({
  title = 'payments.total.title',
  endDate,
  startDate
}: PaymentsTotalProps) {
  const { locale } = useUI();
  const [total, setTotal] = useState<number>(0);


  useEffect(() => {
    const fetchPaymentsCount = async () => {
      const response = await HttpClient.get<{ total: number }>({
        path: '/payment/total',
        baseUrl: '/api',
        config: { params: { start_date: startDate, end_date: endDate } }
      })
      if(response.isOk) {
        setTotal(response.instance.total);
      }
    }
    fetchPaymentsCount();
  } ,[endDate, startDate]);

  const totalFormatted = useMemo(() => {
    const value = Money.tryCreate(total, { locale });
    if(value.isFailure){
      return Money.tryCreate(0, { locale }).instance.formatted;
    }
    return value.instance.formatted;
  } ,[locale, total]);

  return (
    <div id="payments-total" className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <h3>{title}</h3>
      <p>{totalFormatted}</p>
    </div>
  )
}