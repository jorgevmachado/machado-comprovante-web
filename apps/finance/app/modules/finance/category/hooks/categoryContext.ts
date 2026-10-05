'use client';
import { createContext } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import type {
  TCategory ,
  TCategoryFilter ,
  TCategoryPersist,
} from '@/app/modules/finance/category';

import type {
  CategoryActionOptions
} from './types';


export type CategoryContextProps = {
  meta?: TPaginatedMeta;
  items: Array<TCategory>;
  persist: (item: TCategoryPersist, options?: CategoryActionOptions) => Promise<TCategory | undefined>;
  refresh: () => Promise<void>;
  goToPage: (page: number, params?: TCategoryFilter, options?: CategoryActionOptions) => Promise<void>;
  fetchList: (params?: TCategoryFilter, options?: CategoryActionOptions) => Promise<void>;
  isLoading: boolean;
  categories: Array<TCategory>;
  fetchCategories: (name?: string, options?: CategoryActionOptions) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextProps | null>(null)