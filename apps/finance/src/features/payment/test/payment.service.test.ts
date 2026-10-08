import { HttpClient, Result } from '@machado-repo/shared';

import { PaymentService } from '../services/service';
import { EPaymentOrder } from '../types';

const dashboard = {
  payers: [],
  period: { start_date: '2026-09-01', end_date: '2026-10-01' },
  summary: { total: 0, count: 0, average: 0, highest: 0 },
  monthly: [],
  categories: [],
  institutions: [],
  beneficiaries: [],
};

describe('PaymentService', () => {
  const service = new PaymentService();
  const get = jest.spyOn(HttpClient, 'get');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => jest.resetAllMocks());

  it('fetches payment count with normalized date parameters', async () => {
    get.mockResolvedValueOnce(Result.ok({ count: 3 }));

    const result = await service.getCount({
      startDate: new Date('2026-09-01T12:00:00.000Z'),
      endDate: '2026-10-01',
    });

    expect(get).toHaveBeenCalledWith({
      path: '/payment/count',
      baseUrl: '/api',
      config: { params: { start_date: '2026-09-01', end_date: '2026-10-01' } },
    });
    expect(result.instance.count).toBe(3);
  });

  it('fetches payment total and maximum amount', async () => {
    get
      .mockResolvedValueOnce(Result.ok({ total: 125.5 }))
      .mockResolvedValueOnce(Result.ok({}));

    const total = await service.getTotal();
    const max = await service.getMaxPayment();

    expect(get).toHaveBeenNthCalledWith(1, {
      path: '/payment/total',
      baseUrl: '/api',
      config: { params: undefined },
    });
    expect(get).toHaveBeenNthCalledWith(2, {
      path: '/payment/max',
      baseUrl: '/api',
      config: { params: undefined },
    });
    expect(total.instance.total).toBe(125.5);
    expect(max.instance.payment).toBeUndefined();
  });

  it('fetches payments with serialized filter values', async () => {
    get.mockResolvedValueOnce(Result.ok([]));

    const result = await service.getPayments({
      page: '2',
      order: EPaymentOrder.DESC,
      payer: 'payer-id',
      start_date: new Date('2026-09-01T12:00:00.000Z'),
    });

    expect(get).toHaveBeenCalledWith({
      path: '/payment',
      baseUrl: '/api',
      config: {
        params: {
          page: '2',
          order: 'desc',
          payer: 'payer-id',
          start_date: '2026-09-01',
        },
      },
    });
    expect(result.instance).toEqual([]);
  });

  it('sends payment updates with date-only values and preserves failures', async () => {
    put.mockResolvedValueOnce(Result.fail('Payment not found'));

    const result = await service.updatePayment({
      id: 'payment-1',
      amount: 25,
      payment_date: new Date('2026-10-08T18:30:00.000Z'),
    });

    expect(put).toHaveBeenCalledWith({
      path: '/payment/payment-1',
      baseUrl: '/api',
      config: {
        body: { amount: 25, payment_date: '2026-10-08' },
      },
    });
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Payment not found');
  });

  it('fetches dashboard data and hydrates period dates', async () => {
    get.mockResolvedValueOnce(Result.ok(dashboard));

    const result = await service.getDashboard({
      start_date: '2026-09-01',
      end_date: '2026-10-01',
      institution: 'bank-1',
    });

    expect(get).toHaveBeenCalledWith({
      path: '/payment/dashboard',
      baseUrl: '/api',
      config: {
        params: {
          start_date: '2026-09-01',
          end_date: '2026-10-01',
          institution: 'bank-1',
        },
      },
    });
    expect(result.instance.period.start_date)
      .toEqual(new Date('2026-09-01T00:00:00.000Z'));
  });
});
