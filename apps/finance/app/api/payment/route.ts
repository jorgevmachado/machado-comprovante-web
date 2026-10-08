import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  mapPaymentApiListResult,
  paymentFilterToApiParams,
} from '@/src/features/payment/mappers/payment.mapper';
import type { TPaymentFilter } from '@/src/features/payment/types';
import { paymentApiService } from '@/src/server/integrations/finance-api/payment.service';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries()) as TPaymentFilter;
    const result = mapPaymentApiListResult(
      await paymentApiService.fetchList(
        session.token,
        paymentFilterToApiParams(params),
      ),
    );
    if (result.isFailure) {
      return NextResponse.json({ message: result.error }, { status: getApiErrorStatusCode(result) });
    }
    return NextResponse.json(result.instance);
  } catch (error) {
    const message = error instanceof Error && error.message
      ? error.message
      : 'Could not load list of payments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
