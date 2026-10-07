import type { TBaseFilter } from '@machado-repo/ui';

import type { TInstitution } from '@/app/modules/finance/institution';
import type { TBeneficiary } from '@/app/modules/finance/beneficiary';
import { TReceiptConfirm } from '@/app/modules/finance/receipt';
import { TCategory } from '@/app/modules/finance/category';

export enum EPaymentOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type TPaymentFilter = TBaseFilter & {
  order?: EPaymentOrder;
  payer?: string;
  end_date?: Date;
  start_date?: Date;
  beneficiary?: string;
  source_institution?: string;
  destination_institution?: string;
}

export type TPaymentReceipt = TReceiptConfirm & {
  created_at: Date;
  updated_at?: Date;
}

export type TPayment = {
  id: string;
  amount: number;
  receipt: TPaymentReceipt;
  category: TCategory;
  beneficiary: TBeneficiary;
  payment_date: Date;
  source_institution: TInstitution;
  destination_institution?: TInstitution;
}

export type TPaymentPersist = {
  id: string;
  payer?: string;
  amount?: number;
  beneficiary?: string;
  payment_date?: Date;
  source_institution?: string;
  destination_institution?: string;
}

export type TPaymentDashboardPeriod = {
  end_date: Date;
  start_date: Date;
}

export type TPaymentDashboardSummary = {
  total: number;
  count: number;
  average: number;
  highest: number;
}

export type TPaymentDashboardMonthly = {
  total:number;
  count:number;
  period: string;
}

export type TPaymentDashboardInstitution = {
  total:number;
  count:number;
  institution: string;
}

export type TPaymentDashboardBeneficiary = {
  name: string;
  total: number;
  count: number;
  beneficiary_id: string;
}

export type TPaymentDashboardCategory = {
  name: string;
  total: number;
  count: number;
  category_id: string;
}

export type TPaymentDashboardPayer = {
  name: string;
  total: number;
  count: number;
  payer_id: string;
}

export type TPaymentDashboardParams = {
  end_date: Date
  start_date: Date
  institution?: string;
}

export type TPaymentDashboard = {
  payers: Array<TPaymentDashboardPayer>;
  period: TPaymentDashboardPeriod;
  summary: TPaymentDashboardSummary;
  monthly: Array<TPaymentDashboardMonthly>;
  categories: Array<TPaymentDashboardCategory>;
  institutions: Array<TPaymentDashboardInstitution>;
  beneficiaries: Array<TPaymentDashboardBeneficiary>;
}