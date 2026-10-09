import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { institutionApiDataToJson } from '@/src/features/institution/mappers/institution.mapper';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';
import { institutionApiService } from '@/src/server/integrations/finance-api/institution.service';
import { parseResourceFilterQuery, parseResourceWriteBody, requestValidationResponse } from '@/src/server/validation/request-validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(
      request.nextUrl.searchParams,
      ['name', 'institution_type'],
    );
    const response = mapListResult(
      await institutionApiService.fetchList(session.token, params),
      institutionApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of institutions.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parseResourceWriteBody(request);
    const response = mapResult(
      await institutionApiService.create(session.token, body),
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
      'Could not create institution.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}