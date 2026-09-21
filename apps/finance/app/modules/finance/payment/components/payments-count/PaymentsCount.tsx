'use client';
import { useEffect ,useState } from 'react';
import { HttpClient } from '@machado-repo/shared';

type PaymentsCountProps = {
  title?: string;
  endDate?: Date;
  startDate?: Date;
}
export default function PaymentsCount({
  title = 'payments.count.title',
  endDate,
  startDate
}: PaymentsCountProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchPaymentsCount = async () => {
      const response = await HttpClient.get<{ count: number }>({
        path: '/payment/count',
        baseUrl: '/api',
        config: { params: { start_date: startDate, end_date: endDate } }
      })
      if(response.isOk) {
        setCount(response.instance.count);
      }
    }
    fetchPaymentsCount();
  } ,[endDate, startDate]);

  return (
    <div id="payments-count" className="flex-1 overflow-hidden transition-all p-4  rounded-2xl bg-white shadow-md border border-slate-200">
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  )
}