import { useCallback ,useState } from 'react';

import {
  type TAlertActionOptions ,
  useAlert ,
  useLoading,
} from '@machado-repo/ui';

import {
  paymentService ,
  type PaymentServiceDateParams ,
  type TPayment ,
  type TPaymentFilter ,
} from '@/app/modules/finance';

type UsePaymentsFc = (params?: PaymentServiceDateParams, options?: UsePaymentsActionOptions) => Promise<void>;

type UsePaymentsActionOptions = TAlertActionOptions;

type UsePaymentsReturn = {
  payments: Array<TPayment>;
  fetchInfo: (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => Promise<void>;
  maxPayment: number;
  getPayments: (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => Promise<void>;
  totalAmount: number;
  paymentCount: number;
  getTotalAmount: UsePaymentsFc;
  getPaymentCount: UsePaymentsFc;
  getPaymentWithMaxAmount: UsePaymentsFc;
}

const messagePrefix = 'finance.payment';

export default function usePayments(): UsePaymentsReturn {
  const { execute } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [payments ,setPayments] = useState<Array<TPayment>>([]);
  const [maxPayment ,setMaxPayment] = useState<number>(0);
  const [totalAmount ,setTotalAmount] = useState<number>(0);
  const [paymentCount ,setPaymentCount] = useState<number>(0);


  const getPayments = useCallback(async (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => {
    await execute(async () => {
      const response = await paymentService.getPayments(params);
      const result = response.isFailure ? [] : response.instance;
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setPayments(result);
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

  const fetchInfo = useCallback(async (params?: TPaymentFilter, options?: UsePaymentsActionOptions) => {
    const rawOptions = {
      ...options,
      alert: options?.alert ?? 'none',
    }
    await Promise.all([
      getTotalAmount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPaymentCount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPaymentWithMaxAmount({endDate: params?.end_date, startDate: params?.start_date}, rawOptions),
      getPayments(params)
    ])
  },[getPaymentCount, getPaymentWithMaxAmount, getPayments, getTotalAmount]);

  return {
    payments,
    fetchInfo,
    maxPayment,
    getPayments,
    totalAmount,
    paymentCount,
    getTotalAmount,
    getPaymentCount,
    getPaymentWithMaxAmount,

  }
}