import { NextRequest ,NextResponse } from 'next/server';

import { HttpClient, DateVO } from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type { TPayment } from '@/app/modules/finance';

type PaymentRouteContext = {
  params: Promise<{ identifier: string }>
}

export async function PUT(
  request: NextRequest,
  context: PaymentRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await request.json();

    if(body.payment_date) {
      body.payment_date = DateVO.format.dateToDateString(body.payment_date);
    }

    const response = await HttpClient.put<TPayment>({
      path: `/finance/payment/${identifier}` ,
      config: {
        token: session.token ,
        body: body ,
      } ,
    });

    if (response.isFailure) {
      return NextResponse.json({ message: response.error } ,{ status: 422 });
    }
    return NextResponse.json(response.instance);

  } catch (error) {
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not update payment.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}