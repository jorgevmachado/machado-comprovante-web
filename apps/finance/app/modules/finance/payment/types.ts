import type { TInstitution } from '@/app/modules/finance/institution';
import type { TBeneficiary } from '@/app/modules/finance/beneficiary';

export type TPaymentFilter = {
  end_date?: Date;
  start_date?: Date;
  beneficiary?: string;
  source_institution?: string;
  destination_institution?: string;
}

export type TPayment = {
  id: string;
  amount: number;
  beneficiary: TBeneficiary;
  payment_date: Date;
  source_institution: TInstitution;
  destination_institution?: TInstitution;
}