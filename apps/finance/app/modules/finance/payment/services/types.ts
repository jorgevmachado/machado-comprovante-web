import type { TPayment } from '@/app/modules/finance';

export type PaymentsInfoResponse = {
  count: number;
  total: number;
  errors: Array<{service: string, message: string}>;
  maxValue: number;
  payments: Array<TPayment>;
}
