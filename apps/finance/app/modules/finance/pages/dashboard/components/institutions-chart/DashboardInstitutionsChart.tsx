import { BarChart ,Text ,useUI } from '@machado-repo/ui';

import { TPaymentDashboardInstitution } from '@/app/modules/finance';
import { Money } from '@machado-repo/shared';
import { useCallback ,useMemo } from 'react';

type DashboardInstitutionsChartProps = {
  data: Array<TPaymentDashboardInstitution>;
}

export default function DashboardInstitutionsChart({ data }: DashboardInstitutionsChartProps) {
  const { locale } = useUI();
  const institutions = useMemo(() => {
    return [...data].map((item) => ({ ...item, total: Number(item.total) })).sort((a, b) => b.total - a.total).slice(0,10);
  }, [data])

  const formatAxisValue = useCallback(
    (value: number, isCompact: boolean = true) => Money.tryCreate(value, { locale, notation: !isCompact ? undefined : 'compact' }).instance.formatted,
    [locale],
  );

  return (
    <div className="flex-1 overflow-hidden transition-all p-4 rounded-2xl bg-white shadow-md border border-slate-200">
      <Text as="h3" className="mb-2">finance.payment.expense_by_institution.title</Text>
      { data.length === 0
        ? (<Text>finance.payment.expense_by_institution.no_data</Text>)
        : (
          <BarChart
            data={institutions}
            xAxisKey="institution"
            series={[
              {
                dataKey: 'total',
                label: 'Total',
              },
            ]}
            layout="vertical"
            height={320}
            valueFormatter={formatAxisValue}
            tooltipFormatter={(value) => formatAxisValue(value, false) }
          />
        )
      }
    </div>
  );
}