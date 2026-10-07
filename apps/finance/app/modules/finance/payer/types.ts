import type { TBaseFilter } from '@machado-repo/ui';

export type TPayerFilter = TBaseFilter &{
  name?: string;
}

export type TPayer = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}

export type TPayerPersist = {
  id?: string;
  name: string;
}