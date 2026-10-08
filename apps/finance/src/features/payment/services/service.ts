import {
  HttpClient,
  type Result as TResult,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import {
  mapPaymentCountJsonResult,
  mapPaymentDashboardJsonResult,
  mapPaymentJsonListResult,
  mapPaymentJsonResult,
  mapPaymentMaxJsonResult,
  mapPaymentTotalJsonResult,
  paymentFilterToApiParams,
  paymentDashboardParamsToApi,
  paymentDateParamsToApi,
  paymentPersistToApiRequest,
} from '../mappers/payment.mapper';
import type {
  PaymentDashboardJson,
  PaymentJson,
  PaymentJsonList,
  PaymentServiceDateParams,
  PaymentSummaryCountJson,
  PaymentSummaryMaxJson,
  PaymentSummaryTotalJson,
  TPayment,
  TPaymentDashboard,
  TPaymentDashboardParams,
  TPaymentFilter,
  TPaymentPersist,
} from '../types';

export class PaymentService {
  public async getCount(params?: PaymentServiceDateParams): Promise<TResult<{ count: number }>> {
    const result = await HttpClient.get<PaymentSummaryCountJson>({
      path: '/payment/count',
      baseUrl: '/api',
      config: { params: paymentDateParamsToApi(params) },
    });
    return mapPaymentCountJsonResult(result);
  }

  public async getTotal(params?: PaymentServiceDateParams): Promise<TResult<{ total: number }>> {
    const result = await HttpClient.get<PaymentSummaryTotalJson>({
      path: '/payment/total',
      baseUrl: '/api',
      config: { params: paymentDateParamsToApi(params) },
    });
    return mapPaymentTotalJsonResult(result);
  }

  public async getMaxPayment(
    params?: PaymentServiceDateParams,
  ): Promise<TResult<{ payment?: TPayment }>> {
    const result = await HttpClient.get<PaymentSummaryMaxJson>({
      path: '/payment/max',
      baseUrl: '/api',
      config: { params: paymentDateParamsToApi(params) },
    });
    return mapPaymentMaxJsonResult(result);
  }

  public async getPayments(
    params?: TPaymentFilter,
  ): Promise<TResult<Array<TPayment> | TPaginatedListResponse<TPayment>>> {
    const serializedParams = params
      ? paymentFilterToParams(params)
      : undefined;
    const result = await HttpClient.get<PaymentJsonList>({
      path: '/payment',
      baseUrl: '/api',
      config: { params: serializedParams },
    });
    return mapPaymentJsonListResult(result);
  }

  public async updatePayment(item: TPaymentPersist): Promise<TResult<TPayment>> {
    const { id, ...body } = paymentPersistToApiRequest(item);
    const result = await HttpClient.put<PaymentJson>({
      path: `/payment/${id}`,
      baseUrl: '/api',
      config: { body },
    });
    return mapPaymentJsonResult(result);
  }

  public async getDashboard(
    params: TPaymentDashboardParams,
  ): Promise<TResult<TPaymentDashboard>> {
    const result = await HttpClient.get<PaymentDashboardJson>({
      path: '/payment/dashboard',
      baseUrl: '/api',
      config: { params: paymentDashboardParamsToApi(params) },
    });
    return mapPaymentDashboardJsonResult(result);
  }
}

function paymentFilterToParams(params: TPaymentFilter): Record<string, string> {
  return paymentFilterToApiParams(params);
}
