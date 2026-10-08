import type { TBaseFilter } from '@machado-repo/ui';

import type { Payer } from './domain/Payer';

export type { PayerApiData } from '@/src/contracts/finance-api/resources.contracts';

export type TPayerFilter = TBaseFilter & {
  name?: string;
};

export type TPayer = Payer;

export type PayerJson = {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
};

export type TPayerPersist = {
  id?: string;
  name: string;
};
