import type { TCategory } from '@/app/modules/finance/category';

export type TCategoryApiResponse = Omit<TCategory, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at?: string;
}