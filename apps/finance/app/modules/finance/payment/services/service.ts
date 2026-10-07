import {
  HttpClient ,
  Result ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import {
  TPayment ,
  TPaymentFilter ,
  PaymentServiceDateParams ,TPaymentPersist ,TPaymentDashboard ,
  TPaymentDashboardParams ,
} from '@/app/modules/finance';

export class PaymentService {
  public async getCount(params?: PaymentServiceDateParams): Promise<Result<{ count: number }>> {
    return HttpClient.get<{ count: number }>({
      path: '/payment/count',
      baseUrl: '/api',
      config: { params }
    })
  }

  public async getTotal(params?: PaymentServiceDateParams): Promise<Result<{ total: number }>> {
    return HttpClient.get<{ total: number }>({
      path: '/payment/total' ,
      baseUrl: '/api' ,
      config: { params }
    });
  }

  public async getMaxPayment(params?: PaymentServiceDateParams): Promise<Result<{ payment?: TPayment }>> {
    return HttpClient.get<{ payment?: TPayment }>({
      path: '/payment/max',
      baseUrl: '/api',
      config: { params }
    });
  }

  public async getPayments(params?: TPaymentFilter): Promise<Result<TPaginatedListResponse<TPayment> |Array<TPayment>>> {
    return HttpClient.get<Array<TPayment>>({
      path: '/payment',
      baseUrl: '/api',
      config: { params: params }
    })
  }

  public async updatePayment(item: TPaymentPersist): Promise<Result<TPayment>> {
    const { id, ...body } = item;
    return HttpClient.put<TPayment>({
      path: `/payment/${id}`,
      baseUrl: '/api',
      config: { body }
    })
  }

  public async getDashboard(params: TPaymentDashboardParams): Promise<Result<TPaymentDashboard>> {
    return HttpClient.get<TPaymentDashboard>({
      path: '/payment/dashboard',
      baseUrl: '/api',
      config: { params }
    })
  }
}