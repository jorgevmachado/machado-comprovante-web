import type { TPayer } from '@/app/modules/finance/payer';

export type TPayerApiResponse = Omit<TPayer, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at?: string;
}