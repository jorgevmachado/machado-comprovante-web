import type { TBaseFilter } from '@machado-repo/ui';

export type TBeneficiaryFilter = TBaseFilter &{
  name?: string;
}

export type TBeneficiary = {
  id: string;
  name: string;
}