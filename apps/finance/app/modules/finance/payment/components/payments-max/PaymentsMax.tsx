'use client';
import { useEffect ,useMemo ,useState } from 'react';
import { HttpClient ,Money } from '@machado-repo/shared';
import { TPayment } from '@/app/modules/finance/payment/types';
import { useUI } from '@machado-repo/ui';

type PaymentsMaxProps = {
  title?: string;
  endDate?: Date;
  startDate?: Date;
}
export default function PaymentsMax({
  title = 'payments.max.title',
  endDate,
  startDate
}: PaymentsMaxProps) {
  const { locale } = useUI();

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchPaymentsMax = async () => {
      const response = await HttpClient.get<{ payment?: TPayment }>({
        path: '/payment/max',
        baseUrl: '/api',
        config: { params: { start_date: startDate, end_date: endDate } }
      })
      if(response.isOk) {
        setTotal(response.instance.payment?.amount || 0);
      }
    }
    fetchPaymentsMax();
  } ,[endDate, startDate]);

  const totalFormatted = useMemo(() => {
    const value = Money.tryCreate(total, { locale });
    if(value.isFailure){
      return Money.tryCreate(0, { locale }).instance.formatted;
    }
    return value.instance.formatted;
  } ,[locale, total]);

  return (
    <div id="payments-max" className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <h3>{title}</h3>
      <p>{totalFormatted}</p>
    </div>
  )
}