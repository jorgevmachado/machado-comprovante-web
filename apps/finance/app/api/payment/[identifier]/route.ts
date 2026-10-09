import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  mapPaymentApiResult,
  paymentPersistJsonToApiRequest,
} from '@/src/features/payment/mappers/payment.mapper';
import { paymentApiService } from '@/src/server/integrations/finance-api/payment.service';
import { parsePaymentUpdateBody, requestValidationResponse } from '@/src/server/validation/request-validation';

type PaymentRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function PUT(
  request: NextRequest,
  context: PaymentRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parsePaymentUpdateBody(request);
    const result = mapPaymentApiResult(
      await paymentApiService.update(
        session.token,
        identifier,
        paymentPersistJsonToApiRequest(body),
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
      : 'Could not update payment.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
