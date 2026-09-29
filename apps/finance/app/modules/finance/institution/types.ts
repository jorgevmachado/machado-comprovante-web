import type { TBaseFilter } from '@machado-repo/ui';

export type TInstitutionFilter = TBaseFilter & {
  institution_type?: 'source' | 'destination';
}

export type TInstitution = {
  id: string;
  name: string;
}