import { TPaymentDashboard } from '@/app/modules/finance';

export type TPaymentDashboardApiResponse = Omit<TPaymentDashboard, 'period'> & {
  period: {
    end_date: string;
    start_date: string;
  };
};