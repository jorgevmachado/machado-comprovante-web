import { useEffect, useMemo } from 'react';

import { DateVO } from '@machado-repo/shared';

import { Button ,Filters ,Text ,useUser } from '@machado-repo/ui';

import { useNavigation } from '@/app/modules/settings/navigation';

import type { TUser } from '@/app/modules/auth';
import { usePayments } from '@/app/modules/finance';

import {
  DashboardBeneficiaries,
  DashboardCategoriesChart,
  DashboardMonthlyChart,
  DashboardPayers,
  DashboardSummary,
} from '@/app/modules/finance/pages/dashboard/components';

import DashboardInstitutionsChart from './components/institutions-chart';


export default function Dashboard() {
  const { user } = useUser<TUser>();
  const router = useNavigation();

  const {
    dashboard,
    getDashboard,
    defaultStartEndDates,
  } = usePayments();

  const defaultDates = useMemo(
    () => ({
      end_date:
        DateVO.format.dateToDateString(
          defaultStartEndDates.end_date,
        ) ?? '',

      start_date:
        DateVO.format.dateToDateString(
          defaultStartEndDates.start_date,
        ) ?? '',
    }),
    [defaultStartEndDates],
  );

  useEffect(() => {
    void getDashboard();
  }, [getDashboard]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

        {/* Header */}
        <header>
          <Text weight="bold" size="3xl">
            {`finance.welcome.title, {name: ${user?.name}}`}
          </Text>

          <Text className="mt-1 max-w-2xl text-slate-600">
            finance.welcome.subtitle
          </Text>

          <Button
            onClick={() => router.push('/receipt') }
          >
            finance.receipt.subtitle
          </Button>
        </header>

        {/* Filters */}
        <section>
          <Filters
            filters={[
              {
                name: 'start_date',
                label: 'finance.payment.start_date.label',
                placeholder:
                  'finance.payment.start_date.placeholder',
                type: 'date',
                value: defaultDates.start_date,
              },
              {
                name: 'end_date',
                label: 'finance.payment.end_date.label',
                placeholder:
                  'finance.payment.end_date.placeholder',
                type: 'date',
                value: defaultDates.end_date,
              },
            ]}
            onApply={(nextFilters) =>
              getDashboard(nextFilters)
            }
          />
        </section>

        {dashboard ? (
          <>

            <DashboardSummary
              summary={dashboard.summary}
            />

            <DashboardMonthlyChart
              data={dashboard.monthly}
            />

            <DashboardCategoriesChart
              data={dashboard.categories}
            />

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              <DashboardPayers
                data={dashboard.payers}
              />

              <DashboardBeneficiaries
                data={dashboard.beneficiaries}
              />
            </section>

            <DashboardInstitutionsChart
              data={dashboard.institutions}
            />

          </>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Text>
              finance.payment.dashboard.no_data
            </Text>
          </div>
        )}
      </div>
    </main>
  );
}