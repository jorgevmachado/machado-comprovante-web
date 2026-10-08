import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { beneficiaryApiDataToJson } from '@/src/features/beneficiary/mappers/beneficiary.mapper';
import { mapResult } from '@/src/shared/result.mapper';
import { beneficiaryApiService } from '@/src/server/integrations/finance-api/beneficiary.service';

type BeneficiaryRouteContext = {
  params: Promise<{ identifier: string }>
}

export async function GET(
  _: NextRequest,
  context: BeneficiaryRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;

    const response = mapResult(
      await beneficiaryApiService.fetchById(session.token, identifier),
      beneficiaryApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not load beneficiary.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: BeneficiaryRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await request.json();

    const response = mapResult(
      await beneficiaryApiService.update(session.token, identifier, body),
      beneficiaryApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not update beneficiary.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}