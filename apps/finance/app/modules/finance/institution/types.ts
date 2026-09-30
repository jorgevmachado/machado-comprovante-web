import type { TBaseFilter } from '@machado-repo/ui';

export type TInstitutionFilter = TBaseFilter & {
  name?: string;
  institution_type?: 'source' | 'destination';
}

export type TInstitution = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}