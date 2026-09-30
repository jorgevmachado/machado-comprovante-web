import type { TBaseFilter } from '@machado-repo/ui';

import type { TInstitution } from '@/app/modules/finance/institution';
import type { TBeneficiary } from '@/app/modules/finance/beneficiary';
import { TReceiptConfirm } from '@/app/modules/finance/receipt';

export enum EPaymentOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type TPaymentFilter = TBaseFilter & {
  order?: EPaymentOrder;
  end_date?: Date;
  start_date?: Date;
  beneficiary?: string;
  source_institution?: string;
  destination_institution?: string;
}

export type TPaymentReceipt = TReceiptConfirm & {
  created_at: Date;
  updated_at?: Date;
}

export type TPayment = {
  id: string;
  amount: number;
  receipt: TPaymentReceipt;
  beneficiary: TBeneficiary;
  payment_date: Date;
  source_institution: TInstitution;
  destination_institution?: TInstitution;
}