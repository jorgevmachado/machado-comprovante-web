import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { payerApiDataToJson } from '@/src/features/payer/mappers/payer.mapper';
import { mapResult } from '@/src/shared/result.mapper';
import { payerApiService } from '@/src/server/integrations/finance-api/payer.service';

type PayerRouteContext = {
  params: Promise<{ identifier: string }>
}

export async function GET(
  _: NextRequest,
  context: PayerRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;

    const response = mapResult(
      await payerApiService.fetchById(session.token, identifier),
      payerApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not load payer.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: PayerRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await request.json();

    const response = mapResult(
      await payerApiService.update(session.token, identifier, body),
      payerApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not update payer.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}