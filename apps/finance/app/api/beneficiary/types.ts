import type { TBeneficiary } from '@/app/modules/finance/beneficiary';

export type TBeneficiaryApiResponse = Omit<TBeneficiary, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at?: string;
}