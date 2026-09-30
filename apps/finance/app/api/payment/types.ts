import type { TPayment } from '@/app/modules/finance';
import type { TReceiptApiResponse } from '@/app/api/receipt/types';
import type { TInstitutionApiResponse } from '@/app/api/institution/types';
import type { TBeneficiaryApiResponse } from '@/app/api/beneficiary/types';

export type TPaymentApiResponse = Omit<TPayment, 'receipt' | 'beneficiary' | 'source_institution' | 'destination_institution'> & {
  receipt: TReceiptApiResponse;
  beneficiary: TBeneficiaryApiResponse;
  source_institution: TInstitutionApiResponse;
  destination_institution?: TInstitutionApiResponse;
}