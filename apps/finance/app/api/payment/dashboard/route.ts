import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  mapPaymentDashboardApiResult,
  paymentDashboardParamsToApi,
} from '@/src/features/payment/mappers/payment.mapper';
import type { TPaymentDashboardParams } from '@/src/features/payment/types';
import { paymentApiService } from '@/src/server/integrations/finance-api/payment.service';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Partial<TPaymentDashboardParams> = {
      start_date: searchParams.get('start_date') ?? undefined,
      end_date: searchParams.get('end_date') ?? undefined,
      institution: searchParams.get('institution') ?? undefined,
    };
    const result = mapPaymentDashboardApiResult(
      await paymentApiService.fetchDashboard(
        session.token,
        paymentDashboardParamsToApi(params),
      ),
    );
    if (result.isFailure) {
      return NextResponse.json({ message: result.error }, { status: getApiErrorStatusCode(result) });
    }
    return NextResponse.json(result.instance);
  } catch (error) {
    const message = error instanceof Error && error.message
      ? error.message
      : 'Could not load dashboard.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
