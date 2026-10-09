import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { mapReceiptBatchApiResult } from '@/src/features/receipt/mappers/receipt.mapper';
import { receiptApiService } from '@/src/server/integrations/finance-api/receipt.service';
import { parseReceiptBatchBody, requestValidationResponse } from '@/src/server/validation/request-validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await parseReceiptBatchBody(request);
    const result = mapReceiptBatchApiResult(
      await receiptApiService.batch(session.token, body),
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
      : 'Could not batch list of receipts.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
