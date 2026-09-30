import { NextRequest ,NextResponse } from 'next/server';

import { HttpClient } from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';
import { TPayment } from '@/app/modules/finance';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const payload = await request.json();
    const { id, ...body } = payload;

    if(body.payment_date) {
      body.payment_date = DateVO.format.dateToDateString(body.payment_date);
    }

    if(body.due_date) {
      body.due_date = DateVO.format.dateToDateString(body.due_date);
    }

    const response = await HttpClient.post<{payment: TPayment}>({
      path: `/finance/receipt/${id}/confirm` ,
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
      'Could not confirm receipt.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}