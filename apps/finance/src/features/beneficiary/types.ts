import type { TBaseFilter } from '@machado-repo/ui';

import type { BeneficiaryApiData } from '@/src/contracts/finance-api/resources.contracts';
import type { Beneficiary } from './domain/Beneficiary';

export type { BeneficiaryApiData } from '@/src/contracts/finance-api/resources.contracts';

export type TBeneficiaryFilter = TBaseFilter & {
  name?: string;
};

export type TBeneficiary = Beneficiary;

export type BeneficiaryJson = {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
};

export type TBeneficiaryPersist = {
  id?: string;
  name: string;
}