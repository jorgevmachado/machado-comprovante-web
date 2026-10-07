import { Money } from '@machado-repo/shared';
import { RankingList ,Text } from '@machado-repo/ui';

import type { TPaymentDashboardPayer } from '@/app/modules/finance';

type DashboardPayersProps = {
  data: Array<TPaymentDashboardPayer>;
};

export default function DashboardPayers({
  data,
}: DashboardPayersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <Text as="h3">
          finance.payer.title
        </Text>

        <Text as="p" className="mt-1 text-sm text-slate-500">
          finance.payment.distribution_of_payments_by_payer.title
        </Text>
      </div>

      <RankingList
        data={ data.map((item) => ({ id: item.payer_id, label: item.name, value: Number(item.total), count: item.count}))}
        valueFormatter={(value) => Money.tryCreate(value).instance.formatted}
        countFormatter={(count) => `'finance.payment.counter', {count: ${count}}`}
      />
    </div>
  );
}