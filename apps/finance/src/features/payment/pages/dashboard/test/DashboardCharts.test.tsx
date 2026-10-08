import { render, screen } from '@testing-library/react';
import {
  BarChart,
  LineChart,
  RankingList,
  useUI,
} from '@machado-repo/ui';
import { Money, Result } from '@machado-repo/shared';

import DashboardCategoriesChart from '../components/categories-chart/DashboardCategoriesChart';
import DashboardInstitutionsChart from '../components/institutions-chart/DashboardInstitutionsChart';
import DashboardMonthlyChart from '../components/monthly-chart/DashboardMonthlyChart';
import DashboardBeneficiaries from '../components/beneficiaries/DashboardBeneficiaries';
import DashboardPayers from '../components/payers/DashboardPayers';
import DashboardSummary from '../components/summary/DashboardSummary';

jest.mock('@machado-repo/ui', () => ({
  BarChart: jest.fn(() => null),
  LineChart: jest.fn(() => null),
  RankingList: jest.fn(() => null),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useUI: jest.fn(() => ({ locale: 'en-US' })),
}));

describe('dashboard charts and summaries', () => {
  afterEach(() => jest.clearAllMocks());

  it('sorts and limits category bars and formats compact and precise values', () => {
    const data = Array.from({ length: 12 }, (_, index) => ({
      name: `Category ${index}`,
      total: 12 - index,
      count: index,
      category_id: `category-${index}`,
    }));
    const { rerender } = render(<DashboardCategoriesChart data={data} />);

    expect(screen.getByText('finance.payment.expense_by_category.title')).toBeTruthy();
    const chart = jest.mocked(BarChart).mock.calls[0]?.[0] as unknown as {
      data: Array<{ name: string; total: number }>;
      valueFormatter: (value: number) => string;
      tooltipFormatter: (value: number) => string;
    };
    expect(chart.data).toHaveLength(10);
    expect(chart.data[0]).toMatchObject({ name: 'Category 0', total: 12 });
    expect(chart.data[9]).toMatchObject({ name: 'Category 9', total: 3 });
    expect(chart.valueFormatter(1200)).toContain('1.2');
    expect(chart.tooltipFormatter(1200)).toContain('1,200');

    rerender(<DashboardCategoriesChart data={[]} />);
    expect(screen.getByText('finance.payment.expense_by_category.no_data')).toBeTruthy();
    expect(jest.mocked(useUI)).toHaveBeenCalled();
  });

  it('sorts and limits institution bars and handles the no-data view', () => {
    const data = Array.from({ length: 11 }, (_, index) => ({
      institution: `Institution ${index}`,
      total: 11 - index,
      count: index,
    }));
    const { rerender } = render(<DashboardInstitutionsChart data={data} />);
    const chart = jest.mocked(BarChart).mock.calls[0]?.[0] as unknown as {
      data: Array<{ institution: string; total: number }>;
      valueFormatter: (value: number) => string;
      tooltipFormatter: (value: number) => string;
    };

    expect(chart.data).toHaveLength(10);
    expect(chart.data[0]).toMatchObject({ institution: 'Institution 0', total: 11 });
    expect(chart.tooltipFormatter(12.5)).toContain('12.5');
    expect(chart.valueFormatter(1200)).toContain('1.2');

    rerender(<DashboardInstitutionsChart data={[]} />);
    expect(screen.getByText('finance.payment.expense_by_institution.no_data')).toBeTruthy();
  });

  it('renders monthly chart data and value formatters or its empty state', () => {
    const { rerender } = render(<DashboardMonthlyChart data={[{
      period: '2026-10',
      total: 125.5,
      count: 2,
    }]} />);
    const chart = jest.mocked(LineChart).mock.calls[0]?.[0] as unknown as {
      data: Array<{ total: number }>;
      valueFormatter: (value: number) => string;
      tooltipFormatter: (value: number) => string;
    };

    expect(chart.data).toEqual([{ period: '2026-10', total: 125.5, count: 2 }]);
    expect(chart.valueFormatter(125.5)).toBe('$125.50');
    expect(chart.tooltipFormatter(99)).toBe('$99.00');

    rerender(<DashboardMonthlyChart data={[]} />);
    expect(screen.getByText('finance.payment.monthly_progression.no_data')).toBeTruthy();
  });

  it('maps beneficiary and payer rankings and exposes formatting callbacks', () => {
    const beneficiary = [{
      beneficiary_id: 'beneficiary-1',
      name: 'Power Co.',
      total: 125.5,
      count: 2,
    }];
    const payer = [{
      payer_id: 'payer-1',
      name: 'Avery',
      total: 50,
      count: 1,
    }];
    const { rerender } = render(<DashboardBeneficiaries data={beneficiary} />);
    let ranking = jest.mocked(RankingList).mock.calls.at(-1)?.[0] as unknown as {
      data: Array<{ id: string; label: string; value: number; count: number }>;
      valueFormatter: (value: number) => string;
      countFormatter: (count: number) => string;
    };

    expect(ranking.data).toEqual([{
      id: 'beneficiary-1',
      label: 'Power Co.',
      value: 125.5,
      count: 2,
    }]);
    expect(ranking.valueFormatter(125.5)).toBe('$125.50');
    expect(ranking.countFormatter(2)).toContain('2');

    rerender(<DashboardPayers data={payer} />);
    ranking = jest.mocked(RankingList).mock.calls.at(-1)?.[0] as unknown as typeof ranking;
    expect(ranking.data).toEqual([{
      id: 'payer-1',
      label: 'Avery',
      value: 50,
      count: 1,
    }]);
    expect(ranking.valueFormatter(50)).toBe('$50.00');
    expect(ranking.countFormatter(1)).toContain('1');
  });

  it('renders summary values and formats failed values as zero', () => {
    const zero = Money.create(0);
    const tryCreate = jest.spyOn(Money, 'tryCreate')
      .mockReturnValueOnce(Result.fail('Invalid locale'))
      .mockReturnValueOnce(Result.ok(zero));
    render(<DashboardSummary summary={{
      total: 100,
      count: 2,
      average: 50,
      highest: 75,
    }} />);

    expect(screen.getByText('finance.payment.total.title')).toBeTruthy();
    expect(screen.getByText('finance.payment.count.title')).toBeTruthy();
    expect(screen.getByText('finance.payment.average.title')).toBeTruthy();
    expect(screen.getByText('finance.payment.max.title')).toBeTruthy();
    expect(screen.getByText('$0.00')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('$50.00')).toBeTruthy();
    expect(screen.getByText('$75.00')).toBeTruthy();
    expect(useUI).toHaveBeenCalled();
    tryCreate.mockRestore();
  });
});
