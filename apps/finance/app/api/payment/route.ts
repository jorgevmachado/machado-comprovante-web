import { NextRequest ,NextResponse } from 'next/server';

import {
  HttpClient ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type { TPayment } from '@/app/modules/finance/payment';

function convertDateToDateString(date?: Date): string | undefined {
  if(!date) {
    return undefined;
  }

  if(isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().split('T')[0];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queries = Object.fromEntries(request.nextUrl.searchParams.entries());
    const params = {
      ...queries,
      ...(queries.start_date ? { start_date: convertDateToDateString(new Date(queries.start_date)) } : {}),
      ...(queries.end_date ? { end_date: convertDateToDateString(new Date(queries.end_date)) } : {}),

    }
    const response = await HttpClient.get<TPaginatedListResponse<TPayment> | Array<TPayment>>({
      path: '/finance/payment',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of payments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}