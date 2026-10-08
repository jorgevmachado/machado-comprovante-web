import { useEffect, useMemo, useState } from 'react';

import { DateVO } from '@machado-repo/shared';

import { Button ,Filters ,Text ,useUser } from '@machado-repo/ui';

import { useAppNavigation } from '@/src/app-shell/navigation';

import type { TUser } from '@/src/features/auth';
import usePayments from '../../hooks/usePayments';

import {
  DashboardBeneficiaries,
  DashboardCategoriesChart,
  DashboardMonthlyChart,
  DashboardPayers,
  DashboardSummary,
} from './components';

import DashboardInstitutionsChart from './components/institutions-chart';


export default function Dashboard() {
  const { user } = useUser<TUser>();
  const router = useAppNavigation();

  const {
    dashboard,
    dashboardStatus,
    getDashboard,
    defaultStartEndDates,
  } = usePayments();
  const [dashboardFilters, setDashboardFilters] = useState<
    Record<string, string> | undefined
  >(undefined);

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
    <main className="min-h-full flex-1 bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <Text weight="bold" size="3xl">
              {`finance.welcome.title, {name: ${user?.name}}`}
            </Text>
            <Text className="mt-1 max-w-2xl text-slate-600">
              finance.welcome.subtitle
            </Text>
          </div>
          <Button
            className="w-full shrink-0 sm:w-auto"
            onClick={() => router.push('/receipt')}
          >
            finance.receipt.subtitle
          </Button>
        </header>

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
            onApply={(nextFilters) => {
              setDashboardFilters(nextFilters);
              void getDashboard(nextFilters);
            }}
          />
        </section>

        {dashboardStatus === 'loading' ? (
          <div
            className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm sm:min-h-64"
            role="status"
          >
            <Text color="text-slate-600">common.loading</Text>
          </div>
        ) : dashboardStatus === 'error' ? (
          <div
            className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-rose-200 bg-white px-4 py-8 text-center shadow-sm sm:min-h-64"
            role="alert"
          >
            <Text color="text-slate-600">finance.payment.dashboard.error</Text>
            <Button
              tone="primary"
              onClick={() => void getDashboard(dashboardFilters)}
            >
              finance.payment.dashboard.retry
            </Button>
          </div>
        ) : dashboardStatus === 'empty' ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center shadow-sm sm:min-h-64">
            <Text color="text-slate-600">
              finance.payment.dashboard.no_data
            </Text>
          </div>
        ) : dashboard && (
          <>
            <DashboardSummary
              summary={dashboard.summary}
            />

            <section className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6">
              <DashboardMonthlyChart
                data={dashboard.monthly}
              />
              <DashboardCategoriesChart
                data={dashboard.categories}
              />
            </section>

            <section className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
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
        )}
      </div>
    </main>
  );
}