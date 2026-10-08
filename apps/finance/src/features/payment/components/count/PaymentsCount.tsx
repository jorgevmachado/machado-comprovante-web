'use client';
import { Text } from '@machado-repo/ui';
type PaymentsCountProps = {
  title?: string;
  count: number;
}
export default function PaymentsCount({
  count,
  title = 'finance.payment.count.title',
}: PaymentsCountProps) {
  return (
    <div id="payments-count" className="flex-1 overflow-hidden transition-all p-4  rounded-2xl bg-white shadow-md border border-slate-200">
      <Text as="h3">{title}</Text>
      <Text>{count}</Text>
    </div>
  )
}