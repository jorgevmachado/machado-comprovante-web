import { useCallback } from 'react';

import { Money } from '@machado-repo/shared';
import { Text, useUI } from '@machado-repo/ui';

import type { TPaymentDashboardSummary } from '@/app/modules/finance';

type DashboardSummaryProps = {
  summary: TPaymentDashboardSummary;
};

export default function DashboardSummary({
  summary,
}: DashboardSummaryProps) {
  const { locale } = useUI();

  const formatToMoney = useCallback(
    (value: number) => {
      const result = Money.tryCreate(value, { locale });

      if (result.isFailure) {
        return Money.tryCreate(0, { locale }).instance.formatted;
      }

      return result.instance.formatted;
    },
    [locale],
  );

  const items = [
    {
      label: 'finance.payment.total.title',
      value: formatToMoney(summary.total),
      highlight: true,
    },
    {
      label: 'finance.payment.count.title',
      value: summary.count.toString(),
    },
    {
      label: 'finance.payment.average.title',
      value: formatToMoney(summary.average),
    },
    {
      label: 'finance.payment.max.title',
      value: formatToMoney(summary.highest),
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={[
            'rounded-2xl border p-5 transition-shadow',
            'hover:shadow-md',
            item.highlight
              ? 'border-blue-200 bg-blue-50'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <Text
            size="sm"
            className={
              item.highlight
                ? 'text-blue-700'
                : 'text-slate-500'
            }
          >
            {item.label}
          </Text>

          <Text
            weight="bold"
            size={item.highlight ? '3xl' : '2xl'}
            className="mt-2"
          >
            {item.value}
          </Text>
        </div>
      ))}
    </section>
  );
}