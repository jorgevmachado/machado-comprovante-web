import type { TBaseFilter } from '@machado-repo/ui';

import type { Institution } from './domain/Institution';

export type { InstitutionApiData } from '@/src/contracts/finance-api/resources.contracts';

export type TInstitutionType = 'source' | 'destination';

export type TInstitutionFilter = TBaseFilter & {
  name?: string;
  institution_type?: TInstitutionType;
};

export type TInstitution = Institution;

export type InstitutionJson = {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
};

export type TInstitutionPersist = {
  id?: string;
  name: string;
}