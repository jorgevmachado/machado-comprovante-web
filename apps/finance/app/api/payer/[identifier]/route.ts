import { NextRequest ,NextResponse } from 'next/server';

import { HttpClient } from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import { convertPayerApiResponseToPayer } from '@/app/api/payer/business';
import { TPayerApiResponse } from '@/app/api/payer/types';

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

    const response = await HttpClient.get<TPayerApiResponse>({
      path: `/finance/payer/${identifier}` ,
      config: {
        token: session.token ,
      } ,
    });

    if (response.isFailure) {
      return NextResponse.json({ message: response.error } ,{ status: 422 });
    }
    return NextResponse.json(convertPayerApiResponseToPayer(response.instance));

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

    const response = await HttpClient.put<TPayerApiResponse>({
      path: `/finance/payer/${identifier}` ,
      config: {
        token: session.token ,
        body,
      } ,
    });

    if (response.isFailure) {
      return NextResponse.json({ message: response.error } ,{ status: 422 });
    }
    return NextResponse.json(convertPayerApiResponseToPayer(response.instance));

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not update payer.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}