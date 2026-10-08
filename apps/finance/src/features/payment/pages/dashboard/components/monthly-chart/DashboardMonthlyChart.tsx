import { LineChart ,Text ,useUI } from '@machado-repo/ui';

import type { TPaymentDashboardMonthly } from '../../../../types';
import { Money } from '@machado-repo/shared';

type DashboardMonthlyChartProps = {
  data: Array<TPaymentDashboardMonthly>;
}

export default function DashboardMonthlyChart({ data }: DashboardMonthlyChartProps) {
  const { locale } = useUI();
  return (
    <div className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <Text as="h3" className="mb-2">finance.payment.monthly_progression.title</Text>
      { data.length === 0
        ? (<Text>finance.payment.monthly_progression.no_data</Text>)
        : (
          <LineChart
            data={data.map((item) => ({ ...item,total: Number(item.total)}))}
            series={[{ label: 'Total', dataKey: 'total'}]}
            height={300}
            xAxisKey="period"
            valueFormatter={(value) => Money.tryCreate(value, { locale }).instance.formatted}
            tooltipFormatter={(value) => Money.tryCreate(value, { locale }).instance.formatted}
          />
        )
      }

    </div>
  );
}