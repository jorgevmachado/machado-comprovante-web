import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { institutionApiDataToJson } from '@/src/features/institution/mappers/institution.mapper';
import { mapResult } from '@/src/shared/result.mapper';
import { institutionApiService } from '@/src/server/integrations/finance-api/institution.service';
import { parseResourceWriteBody, requestValidationResponse } from '@/src/server/validation/request-validation';

type InstitutionRouteContext = {
  params: Promise<{ identifier: string }>
}

export async function GET(
  _: NextRequest,
  context: InstitutionRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;

    const response = mapResult(
      await institutionApiService.fetchById(session.token, identifier),
      institutionApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not load institution.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: InstitutionRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseResourceWriteBody(request);

    const response = mapResult(
      await institutionApiService.update(session.token, identifier, body),
      institutionApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not update institution.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}