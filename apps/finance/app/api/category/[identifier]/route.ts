import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { categoryApiDataToJson } from '@/src/features/category/mappers/category.mapper';
import { mapResult } from '@/src/shared/result.mapper';
import { categoryApiService } from '@/src/server/integrations/finance-api/category.service';
import { parseResourceWriteBody, requestValidationResponse } from '@/src/server/validation/request-validation';

type CategoryRouteContext = {
  params: Promise<{ identifier: string }>
}

export async function GET(
  _: NextRequest,
  context: CategoryRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = mapResult(
      await categoryApiService.fetchById(session.token, identifier),
      categoryApiDataToJson,
    );

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not load category.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: CategoryRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseResourceWriteBody(request, { description: true });
    const response = mapResult(
      await categoryApiService.update(session.token, identifier, body),
      categoryApiDataToJson,
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
      'Could not update category.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}