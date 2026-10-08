import type { TPaginatedListResponse } from '@machado-repo/shared';
import type { TBaseFilter } from '@machado-repo/ui';

import type {
  BeneficiaryJson,
  TBeneficiary,
} from '../beneficiary/types';
import type { CategoryJson, TCategory } from '../category/types';
import type {
  InstitutionJson,
  TInstitution,
} from '../institution/types';
import type {
  TReceiptConfirm,
} from '../receipt/types';
import type {
  PaymentApiNumber as FinancePaymentApiNumber,
  PaymentApiData as FinancePaymentApiData,
  PaymentApiList as FinancePaymentApiList,
  PaymentDashboardApiResponse as FinancePaymentDashboardApiResponse,
  PaymentPersistApiRequest as FinancePaymentPersistApiRequest,
  PaymentSummaryCountApiData as FinancePaymentSummaryCountApiData,
  PaymentSummaryMaxApiData as FinancePaymentSummaryMaxApiData,
  PaymentSummaryTotalApiData as FinancePaymentSummaryTotalApiData,
  PaymentUpdateApiBody as FinancePaymentUpdateApiBody,
} from '@/src/contracts/finance-api/payment.contracts';
import type { Payment } from './domain/Payment';

export enum EPaymentOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type TPaymentFilter = TBaseFilter & {
  order?: EPaymentOrder;
  payer?: string;
  end_date?: Date | string;
  start_date?: Date | string;
  beneficiary?: string;
  source_institution?: string;
  destination_institution?: string;
};

export type TPaymentReceipt = TReceiptConfirm & {
  created_at: Date;
  updated_at?: Date;
};

export type TPayment = Payment;

export type TPaymentPersist = {
  id: string;
  payer?: string;
  amount?: number;
  beneficiary?: string;
  payment_date?: Date;
  source_institution?: string;
  destination_institution?: string;
};

export type TPaymentDashboardPeriod = {
  end_date: Date;
  start_date: Date;
};

export type TPaymentDashboardSummary = {
  total: number;
  count: number;
  average: number;
  highest: number;
};

export type TPaymentDashboardMonthly = {
  total: number;
  count: number;
  period: string;
};

export type TPaymentDashboardInstitution = {
  total: number;
  count: number;
  institution: string;
};

export type TPaymentDashboardBeneficiary = {
  name: string;
  total: number;
  count: number;
  beneficiary_id: string;
};

export type TPaymentDashboardCategory = {
  name: string;
  total: number;
  count: number;
  category_id: string;
};

export type TPaymentDashboardPayer = {
  name: string;
  total: number;
  count: number;
  payer_id: string;
};

export type TPaymentDashboardParams = {
  end_date: Date | string;
  start_date: Date | string;
  institution?: string;
};

export type TPaymentDashboard = {
  payers: Array<TPaymentDashboardPayer>;
  period: TPaymentDashboardPeriod;
  summary: TPaymentDashboardSummary;
  monthly: Array<TPaymentDashboardMonthly>;
  categories: Array<TPaymentDashboardCategory>;
  institutions: Array<TPaymentDashboardInstitution>;
  beneficiaries: Array<TPaymentDashboardBeneficiary>;
};

export type PaymentServiceDateParams = {
  endDate?: Date | string;
  startDate?: Date | string;
};

export type PaymentsInfoResponse = {
  count: number;
  total: number;
  errors: Array<{ service: string; message: string }>;
  maxValue: number;
  payments: Array<TPayment>;
};

export type PaymentApiNumber = FinancePaymentApiNumber;

export type PaymentSummaryCountApiData = FinancePaymentSummaryCountApiData;

export type PaymentSummaryTotalApiData = FinancePaymentSummaryTotalApiData;

export type PaymentSummaryMaxApiData = FinancePaymentSummaryMaxApiData;

export type PaymentSummaryCountJson = {
  count: number;
};

export type PaymentSummaryTotalJson = {
  total: number;
};

export type PaymentSummaryMaxJson = {
  payment?: PaymentJson;
};

export type PaymentApiData = FinancePaymentApiData;

export type PaymentJson = {
  id: string;
  amount: number;
  payment_date: string;
  receipt: Omit<TPaymentReceipt, 'created_at' | 'updated_at' | 'payment_date' | 'due_date'> & {
    created_at: string;
    updated_at?: string;
    payment_date?: string;
    due_date?: string;
  };
  category: CategoryJson;
  beneficiary: BeneficiaryJson;
  source_institution: InstitutionJson;
  destination_institution?: InstitutionJson;
};

export type PaymentApiList = FinancePaymentApiList;
export type PaymentJsonList =
  | Array<PaymentJson>
  | TPaginatedListResponse<PaymentJson>;
export type PaymentDomainList =
  | Array<Payment>
  | TPaginatedListResponse<Payment>;

export type PaymentPersistApiRequest = FinancePaymentPersistApiRequest;
export type PaymentUpdateApiBody = FinancePaymentUpdateApiBody;

export type PaymentDashboardApiResponse = FinancePaymentDashboardApiResponse;

export type PaymentDashboardJson = Omit<TPaymentDashboard, 'period'> & {
  period: {
    end_date: string;
    start_date: string;
  };
};

export type PaymentDashboardParams = Partial<TPaymentDashboardParams>;

export type PaymentPersist = TPaymentPersist;

export type PaymentDependencies = {
  category: TCategory;
  beneficiary: TBeneficiary;
  source_institution: TInstitution;
  destination_institution?: TInstitution;
};
