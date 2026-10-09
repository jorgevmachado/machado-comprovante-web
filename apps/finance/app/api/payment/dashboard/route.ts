import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  mapPaymentDashboardApiResult,
  paymentDashboardParamsToApi,
} from '@/src/features/payment/mappers/payment.mapper';
import { paymentApiService } from '@/src/server/integrations/finance-api/payment.service';
import { parsePaymentDashboardQuery, requestValidationResponse } from '@/src/server/validation/request-validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parsePaymentDashboardQuery(request.nextUrl.searchParams);
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
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message
      ? error.message
      : 'Could not load dashboard.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
