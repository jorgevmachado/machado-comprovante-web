import { NextRequest ,NextResponse } from 'next/server';

import {
  DateVO,
  HttpClient ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import { getServerSession } from '@/app/modules/auth/session';

import type { TPayment } from '@/app/modules/finance/payment';
import { TPaymentApiResponse } from '@/app/api/payment/types';

function convertPaymentReceiptApiResponseToPaymentReceipt(receipt: TPaymentApiResponse['receipt']): TPayment['receipt'] {

  return {
    id: receipt.id,
    fine: receipt.extracted_data.fine.value,
    payer: receipt.extracted_data.payer.value,
    barcode: receipt.extracted_data.barcode.value,
    category: receipt.extracted_data.category.value ?? '',
    due_date: DateVO.format.dateStringToDate(receipt.extracted_data.due_date.value),
    discount: receipt.extracted_data.discount.value,
    interest: receipt.extracted_data.interest.value,
    beneficiary: receipt.extracted_data.beneficiary.value ?? '',
    paid_amount: receipt.extracted_data.paid_amount.value ?? 0,
    payment_date: DateVO.format.dateStringToDate(receipt.extracted_data.payment_date.value),
    total_charges: receipt.extracted_data.total_charges.value,
    authentication: receipt.extracted_data.authentication.value,
    transaction_id: receipt.extracted_data.transaction_id.value,
    effective_payer: receipt.extracted_data.effective_payer.value,
    document_amount: receipt.extracted_data.document_amount.value,
    source_institution: receipt.extracted_data.source_institution.value ?? '',
    destination_institution: receipt.extracted_data.destination_institution.value ?? '',
    created_at: DateVO.format.dateStringToDate(receipt.created_at) as Date,
    updated_at: DateVO.format.dateStringToDate(receipt.updated_at),
  }
}

function convertPaymentApiResponseToPayment(payment: TPaymentApiResponse): TPayment {
  const beneficiary = {
    ...payment.beneficiary,
    created_at: DateVO.format.dateStringToDate(payment.beneficiary.created_at),
    updated_at: DateVO.format.dateStringToDate(payment.beneficiary.updated_at),
  }
  const destination_institution = payment.destination_institution ? {
    ...payment.destination_institution,
    created_at: DateVO.format.dateStringToDate(payment.destination_institution.created_at) as Date,
    updated_at: DateVO.format.dateStringToDate(payment.destination_institution.updated_at),
  } : undefined;
  const source_institution = {
    ...payment.source_institution,
    created_at: DateVO.format.dateStringToDate(payment.source_institution.created_at) as Date,
    updated_at: DateVO.format.dateStringToDate(payment.source_institution.updated_at),
  }

  return {
    ...payment,
    receipt: convertPaymentReceiptApiResponseToPaymentReceipt(payment.receipt),
    beneficiary,
    source_institution,
    destination_institution,
  }
}

function convertInstanceToPaymentList(payment: TPaginatedListResponse<TPaymentApiResponse> | Array<TPaymentApiResponse>): TPaginatedListResponse<TPayment> | Array<TPayment> {
  if (Array.isArray(payment)) {
    return payment.map(convertPaymentApiResponseToPayment);
  }
  return {
    ...payment,
    items: payment.items.map(convertPaymentApiResponseToPayment)
  };
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
      ...(queries.start_date ? { start_date: DateVO.format.dateToDateString(queries.start_date) } : {}),
      ...(queries.end_date ? { end_date: DateVO.format.dateToDateString(queries.end_date) } : {}),

    }
    const response = await HttpClient.get<TPaginatedListResponse<TPaymentApiResponse> | Array<TPaymentApiResponse>>({
      path: '/finance/payment',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(convertInstanceToPaymentList(response.instance));
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of payments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}