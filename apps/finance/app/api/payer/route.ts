import { NextRequest ,NextResponse } from 'next/server';

import {
  HttpClient ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import { TPayerApiResponse } from '@/app/api/payer/types';
import {
  convertInstanceToPayerList ,
  convertPayerApiResponseToPayer,
} from '@/app/api/payer/business';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await HttpClient.get<TPaginatedListResponse<TPayerApiResponse> | Array<TPayerApiResponse>>({
      path: '/finance/payer',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(convertInstanceToPayerList(response.instance));
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of payers.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await request.json();
    const response = await HttpClient.post<TPayerApiResponse>({
      path: `/finance/payer` ,
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
      'Could not create payer.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}