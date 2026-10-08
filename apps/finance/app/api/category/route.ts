import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  categoryApiDataToJson,
} from '@/src/features/category/mappers/category.mapper';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';
import { categoryApiService } from '@/src/server/integrations/finance-api/category.service';
import type { CategoryApiWriteRequest } from '@/src/server/integrations/finance-api/contracts/category.contracts';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = mapListResult(
      await categoryApiService.fetchList(session.token, params),
      categoryApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of categories.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body: CategoryApiWriteRequest = await request.json();
    const response = mapResult(
      await categoryApiService.create(session.token, body),
      categoryApiDataToJson,
    );
    if (response.isFailure) {
      return NextResponse.json({ message: response.error } ,{ status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not create category.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}