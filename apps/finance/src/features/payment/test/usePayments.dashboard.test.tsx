/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { paymentService } from '../services';
import type { TPayment, TPaymentDashboard } from '../types';
import usePayments from '../hooks/usePayments';

jest.mock('@machado-repo/ui', () => ({
  useAlert: () => ({ executeServiceAlert: jest.fn() }),
  useLoading: () => ({
    execute: <T,>(callback: () => Promise<T>) => callback(),
    isLoading: false,
  }),
}));

const dashboard: TPaymentDashboard = {
  payers: [],
  period: {
    start_date: new Date('2026-09-01T00:00:00.000Z'),
    end_date: new Date('2026-10-01T00:00:00.000Z'),
  },
  summary: {
    total: 10,
    count: 1,
    average: 10,
    highest: 10,
  },
  monthly: [],
  categories: [],
  institutions: [],
  beneficiaries: [],
};

const payment = {
  id: 'payment-1',
  amount: 12,
} as TPayment;

describe('usePayments dashboard state', () => {
  const getDashboard = jest.spyOn(paymentService, 'getDashboard');
  const getPayments = jest.spyOn(paymentService, 'getPayments');
  const getMaxPayment = jest.spyOn(paymentService, 'getMaxPayment');
  const getTotal = jest.spyOn(paymentService, 'getTotal');
  const getCount = jest.spyOn(paymentService, 'getCount');
  const updatePayment = jest.spyOn(paymentService, 'updatePayment');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('moves from loading to success when dashboard data is returned', async () => {
    getDashboard.mockResolvedValueOnce(Result.ok(dashboard));
    const { result } = renderHook(() => usePayments());

    expect(result.current.dashboardStatus).toBe('loading');

    await act(async () => {
      await result.current.getDashboard();
    });

    expect(result.current.dashboardStatus).toBe('success');
    expect(result.current.dashboard).toEqual(dashboard);
  });

  it('uses the empty state when the dashboard has no payments', async () => {
    getDashboard.mockResolvedValueOnce(Result.ok({
      ...dashboard,
      summary: { ...dashboard.summary, count: 0 },
    }));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getDashboard();
    });

    expect(result.current.dashboardStatus).toBe('empty');
  });

  it('uses the error state when the service returns a failure', async () => {
    getDashboard.mockResolvedValueOnce(Result.fail('Request failed'));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getDashboard();
    });

    expect(result.current.dashboardStatus).toBe('error');
  });

  it('uses the error state when the service throws', async () => {
    getDashboard.mockRejectedValueOnce(new Error('Network failure'));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getDashboard();
    });

    expect(result.current.dashboardStatus).toBe('error');
  });

  it('gets payments as a list and handles paginated results and navigation', async () => {
    getPayments
      .mockResolvedValueOnce(Result.ok([payment]))
      .mockResolvedValueOnce(Result.ok({
        items: [payment],
        meta: {
          total: 3,
          limit: 1,
          offset: 0,
          total_pages: 3,
          current_page: 1,
        },
      }))
      .mockResolvedValueOnce(Result.ok([payment]));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getPayments();
    });
    expect(result.current.payments).toEqual([payment]);

    await act(async () => {
      await result.current.getPayments({ page: '1' });
    });
    expect(result.current.meta?.current_page).toBe(1);

    await act(async () => {
      await result.current.goToPage(3, { payer: 'payer-1' });
    });
    expect(getPayments).toHaveBeenLastCalledWith({ payer: 'payer-1', page: '3' });
    expect(result.current.payments).toEqual([payment]);
  });

  it('loads summary information, updates a payment and fetches info with defaults', async () => {
    getTotal.mockResolvedValue(Result.ok({ total: 25 }));
    getCount.mockResolvedValue(Result.ok({ count: 2 }));
    getMaxPayment.mockResolvedValue(Result.ok({ payment }));
    getPayments.mockResolvedValue(Result.ok([payment]));
    updatePayment.mockResolvedValue(Result.ok(payment));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getTotalAmount();
      await result.current.getPaymentCount();
      await result.current.getPaymentWithMaxAmount();
      await result.current.updatePayment({ id: payment.id });
    });

    expect(result.current.totalAmount).toBe(25);
    expect(result.current.paymentCount).toBe(2);
    expect(result.current.maxPayment).toBe(12);
    expect(updatePayment).toHaveBeenCalledWith({ id: payment.id });

    await act(async () => {
      await result.current.fetchInfo({
        payer: 'payer-1',
        start_date: new Date('2026-09-01T00:00:00.000Z'),
        end_date: new Date('2026-10-01T00:00:00.000Z'),
      });
    });
    expect(getPayments).toHaveBeenLastCalledWith(expect.objectContaining({
      payer: 'payer-1',
      page: '1',
      order_by: 'created_at',
      limit: '3',
    }));
    expect(getTotal).toHaveBeenLastCalledWith(expect.objectContaining({
      startDate: new Date('2026-09-01T00:00:00.000Z'),
      endDate: new Date('2026-10-01T00:00:00.000Z'),
    }));
  });

  it('resets failed summary results and avoids requesting the current or loading page', async () => {
    getTotal.mockResolvedValue(Result.fail('Total error'));
    getCount.mockResolvedValue(Result.fail('Count error'));
    getMaxPayment.mockResolvedValue(Result.fail('Max error'));
    getPayments.mockResolvedValue(Result.ok({
      items: [payment],
      meta: {
        total: 1,
        limit: 1,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
    }));
    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.getTotalAmount();
      await result.current.getPaymentCount();
      await result.current.getPaymentWithMaxAmount();
      await result.current.getPayments();
    });
    getPayments.mockClear();

    await act(async () => {
      await result.current.goToPage(1);
    });

    expect(result.current.totalAmount).toBe(0);
    expect(result.current.paymentCount).toBe(0);
    expect(result.current.maxPayment).toBe(0);
    expect(getPayments).not.toHaveBeenCalled();
  });
});
