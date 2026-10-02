import type { TBaseFilter } from '@machado-repo/ui';

export type TCategoryFilter = TBaseFilter &{
  name?: string;
}

export type TCategory = {
  id: string;
  name: string;
  description?: string;
}

export type TCategoryPersist = {
  id?: string;
  name: string;
  description?: string;
}