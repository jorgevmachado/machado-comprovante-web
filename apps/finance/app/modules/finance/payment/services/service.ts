import {
  PaymentsInfoResponse ,
  TPayment ,
  TPaymentFilter,
} from '@/app/modules/finance';
import { HttpClient ,Result } from '@machado-repo/shared';


export class PaymentService {
  public async info(params?: TPaymentFilter): Promise<Result<PaymentsInfoResponse>> {
    const errors: Array<{service: string, message: string}> = [];
    const countResponse = await this.getCount(params?.start_date, params?.end_date);
    if(countResponse.isFailure) {
      errors.push({ service: 'count', message: countResponse.error });
    }
    const totalResponse = await this.getTotal(params?.start_date, params?.end_date);
    if(totalResponse.isFailure) {
      errors.push({ service: 'total', message: totalResponse.error });
    }
    const maxPaymentResponse = await this.getMaxPayment(params?.start_date, params?.end_date);
    if(maxPaymentResponse.isFailure) {
      errors.push({ service: 'max_payment', message: maxPaymentResponse.error });
    }

    const payments = await this.getPayments(params);
    if(payments.isFailure) {
      errors.push({ service: 'payments', message: payments.error });
    }

    return Result.ok({
      count: countResponse.isOk ? countResponse.instance.count : 0,
      total: totalResponse.isOk ? totalResponse.instance.total : 0,
      maxValue: maxPaymentResponse.isOk ? maxPaymentResponse.instance.payment?.amount ?? 0 : 0,
      payments: payments.isOk ? payments.instance : [],
      errors
    });
  }

  public async getCount(startDate?: Date, endDate?: Date): Promise<Result<{ count: number }>> {
    return HttpClient.get<{ count: number }>({
      path: '/payment/count',
      baseUrl: '/api',
      config: { params: { start_date: startDate, end_date: endDate } }
    })
  }

  public async getTotal(startDate?: Date, endDate?: Date): Promise<Result<{ total: number }>> {
    return HttpClient.get<{ total: number }>({
      path: '/payment/total' ,
      baseUrl: '/api' ,
      config: { params: { start_date: startDate ,end_date: endDate } }
    });
  }

  public async getMaxPayment(startDate?: Date, endDate?: Date): Promise<Result<{ payment?: TPayment }>> {
    return HttpClient.get<{ payment?: TPayment }>({
      path: '/payment/max',
      baseUrl: '/api',
      config: { params: { start_date: startDate, end_date: endDate } }
    });
  }

  public async getPayments(params?: TPaymentFilter): Promise<Result<Array<TPayment>>> {
    return HttpClient.get<Array<TPayment>>({
      path: '/payment',
      baseUrl: '/api',
      config: { params: params }
    })
  }
}