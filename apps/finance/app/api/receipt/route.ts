import { NextRequest ,NextResponse } from 'next/server';

import { HttpClient ,type TPaginatedListResponse } from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type { TReceipt } from '@/app/modules/finance/receipt';
import { TReceiptApiResponse } from '@/app/api/receipt/types';

const convertDateStringToDate = (dateString?: string): Date | undefined => {
  if (!dateString){
    return undefined;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  if(!year || !month || !day) {
    return undefined;
  }
  return new Date(year, month - 1, day);
}

const convertReceiptApiResponseToReceipt = (receipt: TReceiptApiResponse): TReceipt => {
  const { extracted_data, ...rest } = receipt;
  return {
    ...rest,
    extracted_data: {
      ...extracted_data,
      due_date: {
        ...extracted_data.due_date,
        value: convertDateStringToDate(extracted_data.due_date.value)
      },
      payment_date: {
        ...extracted_data.payment_date,
        value: convertDateStringToDate(extracted_data.payment_date.value)
      }
    }
  };
}

const convertInstanceToReceiptList = (instance: TPaginatedListResponse<TReceiptApiResponse> | Array<TReceiptApiResponse>): TPaginatedListResponse<TReceipt> | Array<TReceipt> => {
  if (Array.isArray(instance)) {
    return instance.map(convertReceiptApiResponseToReceipt);
  } else {
    return {
      ...instance,
      items: instance.items.map(convertReceiptApiResponseToReceipt)
    };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await HttpClient.get<TPaginatedListResponse<TReceiptApiResponse> | Array<TReceiptApiResponse>>({
      path: '/finance/receipt',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(convertInstanceToReceiptList(response.instance));
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of receipts.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { id, ...body } = payload;
    if(body.payment_date) {
      body.payment_date = new Date(body.payment_date).toISOString().split('T')[0];
    }

    if(body.due_date) {
      body.due_date = new Date(body.due_date).toISOString().split('T')[0];
    }
    const response = await HttpClient.put<TReceiptApiResponse>({
      path: `/finance/receipt/${id}`,
      config: {
        token: session.token,
        body
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(convertReceiptApiResponseToReceipt(response.instance));
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not update receipt.';
    return NextResponse.json({ message }, { status: 500 });
  }
}