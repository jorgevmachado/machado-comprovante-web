import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { receiptConfirmJsonToApiRequest } from '@/src/features/receipt/mappers/receipt.mapper';
import type { ReceiptConfirmJson } from '@/src/features/receipt/types';
import { receiptApiService } from '@/src/server/integrations/finance-api/receipt.service';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json() as ReceiptConfirmJson;
    const result = await receiptApiService.confirm(
      session.token,
      receiptConfirmJsonToApiRequest(payload),
    );
    if (result.isFailure) {
      return NextResponse.json({ message: result.error }, { status: getApiErrorStatusCode(result) });
    }
    return NextResponse.json(result.instance);
  } catch (error) {
    const message = error instanceof Error && error.message
      ? error.message
      : 'Could not confirm receipt.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
