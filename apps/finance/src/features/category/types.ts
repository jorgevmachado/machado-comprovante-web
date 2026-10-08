import type { TBaseFilter } from '@machado-repo/ui';

import type { Category } from './domain/Category';

export type { CategoryApiData } from '@/src/contracts/finance-api/resources.contracts';

export type TCategoryFilter = TBaseFilter & {
  name?: string;
};

export type TCategory = Category;

export type CategoryJson = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type TCategoryPersist = {
  id?: string;
  name: string;
  description?: string;
};
