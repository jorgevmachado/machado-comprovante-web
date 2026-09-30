import { TInstitution } from '@/app/modules/finance/institution';

export type TInstitutionApiResponse = Omit<TInstitution, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at?: string;
}