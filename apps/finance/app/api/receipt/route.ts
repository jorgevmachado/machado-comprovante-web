import { NextRequest ,NextResponse } from 'next/server';

import {
  DateVO ,
  HttpClient ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type { TReceipt } from '@/app/modules/finance/receipt';
import { TReceiptApiResponse } from '@/app/api/receipt/types';

const convertReceiptApiResponseToReceipt = (receipt: TReceiptApiResponse): TReceipt => {
  const { extracted_data, ...rest } = receipt;
  return {
    ...rest,
    created_at: DateVO.format.dateStringToDate(receipt.created_at) as Date,
    updated_at: DateVO.format.dateStringToDate(receipt.updated_at),
    extracted_data: {
      ...extracted_data,
      due_date: {
        ...extracted_data.due_date,
        value: DateVO.format.dateStringToDate(extracted_data.due_date.value)
      },
      payment_date: {
        ...extracted_data.payment_date,
        value: DateVO.format.dateStringToDate(extracted_data.payment_date.value)
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
      body.payment_date = DateVO.format.dateToDateString(body.payment_date);
    }

    if(body.due_date) {
      body.due_date = DateVO.format.dateToDateString(body.due_date);
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