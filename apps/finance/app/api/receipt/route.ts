import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  mapReceiptApiListResult,
  mapReceiptApiResult,
  receiptConfirmJsonToApiRequest,
} from '@/src/features/receipt/mappers/receipt.mapper';
import { receiptApiService } from '@/src/server/integrations/finance-api/receipt.service';
import { parseResourceFilterQuery, parseReceiptConfirmBody, requestValidationResponse } from '@/src/server/validation/request-validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = mapReceiptApiListResult(
      await receiptApiService.fetchList(
        session.token,
        parseResourceFilterQuery(request.nextUrl.searchParams),
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
      : 'Could not load list of receipts.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await parseReceiptConfirmBody(request);
    const result = mapReceiptApiResult(
      await receiptApiService.update(
        session.token,
        receiptConfirmJsonToApiRequest(payload),
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
      : 'Could not update receipt.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
