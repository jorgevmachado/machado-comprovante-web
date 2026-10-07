import { NextRequest ,NextResponse } from 'next/server';

import {
  DateVO,
  HttpClient ,
} from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type {
  TPaymentDashboard,
} from '@/app/modules/finance/payment';
import {
  TPaymentDashboardApiResponse
} from '@/app/api/payment/dashboard/types';

function convertInstanceToPaymentDashboard(dashboard: TPaymentDashboardApiResponse): TPaymentDashboard {
  return {
    ...dashboard,
    period: {
      start_date: DateVO.format.dateStringToDate(dashboard.period.start_date) as Date,
      end_date: DateVO.format.dateStringToDate(dashboard.period.end_date) as Date,
    },
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queries = Object.fromEntries(request.nextUrl.searchParams.entries());
    const params = {
      ...queries,
      ...(queries.start_date ? { start_date: DateVO.format.dateToDateString(queries.start_date) } : {}),
      ...(queries.end_date ? { end_date: DateVO.format.dateToDateString(queries.end_date) } : {}),

    }
    const response = await HttpClient.get<TPaymentDashboardApiResponse>({
      path: '/finance/payment/dashboard',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(convertInstanceToPaymentDashboard(response.instance));
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load dashboard.';
    return NextResponse.json({ message }, { status: 500 });
  }
}