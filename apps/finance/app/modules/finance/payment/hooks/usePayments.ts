import { useCallback ,useMemo ,useState } from 'react';

import {
  type TAlertActionOptions ,
  useAlert ,
  useLoading,
} from '@machado-repo/ui';

import {
  EPaymentOrder ,
  paymentService ,
  type PaymentServiceDateParams ,
  type TPayment ,TPaymentDashboard ,TPaymentDashboardParams ,
  type TPaymentFilter ,TPaymentPersist ,
} from '@/app/modules/finance';
import type { TPaginatedMeta } from '@machado-repo/shared';

type UsePaymentsFc = (params?: PaymentServiceDateParams, options?: UsePaymentsActionOptions) => Promise<void>;

type UsePaymentsActionOptions = TAlertActionOptions;

type UsePaymentsReturn = {
  meta?: TPaginatedMeta;
  payments: Array<TPayment>;
  goToPage: (page: number, params?: TPaymentFilter, options?: UsePaymentsActionOptions) => Promise<void>;
  fetchInfo: (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => Promise<void>;
  dashboard?: TPaymentDashboard;
  isLoading: boolean;
  maxPayment: number;
  getPayments: (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => Promise<void>;
  totalAmount: number;
  getDashboard: (params?: Partial<TPaymentDashboardParams>, options?: UsePaymentsActionOptions) => Promise<void>;
  paymentCount: number;
  updatePayment:(item: TPaymentPersist, options?: UsePaymentsActionOptions) => Promise<void>;
  getTotalAmount: UsePaymentsFc;
  getPaymentCount: UsePaymentsFc;
  defaultStartEndDates: { start_date: Date; end_date: Date };
  getPaymentWithMaxAmount: UsePaymentsFc;
}

const messagePrefix = 'finance.payment';

export default function usePayments(): UsePaymentsReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [payments ,setPayments] = useState<Array<TPayment>>([]);
  const [maxPayment ,setMaxPayment] = useState<number>(0);
  const [totalAmount ,setTotalAmount] = useState<number>(0);
  const [paymentCount ,setPaymentCount] = useState<number>(0);
  const [dashboard, setDashboard] = useState<TPaymentDashboard | undefined>(undefined);

  const defaultStartEndDates = useMemo(() => {
    const end_date = new Date();
    const start_date = new Date(end_date);
    start_date.setMonth(start_date.getMonth() - 1);
    return { start_date, end_date };
  },[])

  const getPayments = useCallback(async (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.getPayments(params);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      if(Array.isArray(response.instance)) {
        setPayments(response.instance ?? []);
        return;
      }
      setPayments(response.instance.items ?? []);
      setMeta(response.instance.meta);
    });
  }, [execute, executeServiceAlert]);

  const getPaymentWithMaxAmount = useCallback(async (params?: PaymentServiceDateParams, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.getMaxPayment(params);
      const payment = response.instance?.payment;
      const paymentAmount = payment?.amount ?? 0;
      const result = response.isFailure ? 0 : paymentAmount;
      executeServiceAlert({
        isOk: response.isOk,
        type: 'max_amount',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setMaxPayment(result);
    });
  }, [execute, executeServiceAlert]);

  const getTotalAmount = useCallback(async (params?: PaymentServiceDateParams, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.getTotal(params);
      const result = response.isFailure ? 0 : response.instance.total;
      executeServiceAlert({
        isOk: response.isOk,
        type: 'total',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setTotalAmount(result);
    });
  }, [execute, executeServiceAlert]);

  const getPaymentCount = useCallback(async (params?: PaymentServiceDateParams, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.getCount(params);
      const result = response.isFailure ? 0 : response.instance.count;
      executeServiceAlert({
        isOk: response.isOk,
        type: 'count',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setPaymentCount(result);
    });
  }, [execute, executeServiceAlert]);

  const fetchInfo = useCallback(async (filters?: TPaymentFilter, options?: UsePaymentsActionOptions) => {
    const rawOptions = {
      ...options,
      alert: options?.alert ?? 'none',
    }
    const params = {
      ...filters,
      ...(filters?.page ? { page: filters.page } : { page: '1' }),
      ...(filters?.order ? { order: filters.order } : { order: EPaymentOrder.DESC }),
      ...(filters?.order_by ? { order_by: filters.order_by } : { order_by: 'created_at' }),
      ...(filters?.limit ? { limit: filters.limit } : { limit: '3' }),
    }
    await Promise.all([
      getTotalAmount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPaymentCount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPaymentWithMaxAmount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPayments(params)
    ])
  },[getPaymentCount, getPaymentWithMaxAmount, getPayments, getTotalAmount]);

  const goToPage = useCallback(async (page: number, params?: TPaymentFilter, options?: UsePaymentsActionOptions) => {
    const targetPage = Math.min(Math.max(page, 1), Math.max(meta?.total_pages ?? 1, 1));

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    const nextParams = {
      ...params,
      page: targetPage.toString(),
    };

    await getPayments(nextParams, options);
  }, [getPayments, isLoading, meta]);

  const updatePayment = useCallback(async (item: TPaymentPersist, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.updatePayment(item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
    });
  }, [execute, executeServiceAlert]);

  const getDashboard = useCallback(async (params?: Partial<TPaymentDashboardParams>, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const end_date = params?.end_date ?? defaultStartEndDates.end_date;
      const start_date = params?.start_date ?? defaultStartEndDates.start_date;
      const filters: TPaymentDashboardParams = {
        ...params,
        end_date,
        start_date,
      };
      const response = await paymentService.getDashboard(filters);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'dashboard',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        setDashboard(response.instance);
      }
    });
  }, [defaultStartEndDates.end_date, defaultStartEndDates.start_date, execute, executeServiceAlert]);

  return {
    meta,
    payments,
    goToPage,
    fetchInfo,
    dashboard,
    isLoading,
    maxPayment,
    getPayments,
    totalAmount,
    paymentCount,
    getDashboard,
    updatePayment,
    getTotalAmount,
    getPaymentCount,
    defaultStartEndDates,
    getPaymentWithMaxAmount,
  }
}