import type { TBaseFilter } from '@machado-repo/ui';
import type { TPaginatedListResponse } from '@machado-repo/shared';

import type {
  EReceiptFieldStatus as EReceiptFieldStatusValue,
  EReceiptProcessingStatus as EReceiptProcessingStatusValue,
  ReceiptApiData as FinanceReceiptApiData,
  ReceiptApiDate as FinanceReceiptApiDate,
  ReceiptApiList as FinanceReceiptApiList,
  ReceiptApiNumber as FinanceReceiptApiNumber,
  ReceiptBatchApiData as FinanceReceiptBatchApiData,
  ReceiptConfirmApiRequest as FinanceReceiptConfirmApiRequest,
  ReceiptUploadApiData as FinanceReceiptUploadApiData,
  TReceiptApiData as FinanceTReceiptApiData,
  TReceiptApiDataField as FinanceTReceiptApiDataField,
  TReceiptDataError as FinanceTReceiptDataError,
} from '@/src/contracts/finance-api/receipt.contracts';
import type { Receipt } from './domain/Receipt';

export const EReceiptProcessingStatus = {
  FAILED: 'FAILED',
  RECEIVED: 'RECEIVED',
  PROCESSED: 'PROCESSED',
  PROCESSING: 'PROCESSING',
} as const;
export type EReceiptProcessingStatus = EReceiptProcessingStatusValue;

export const EReceiptFieldStatus = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  AMBIGUOUS: 'AMBIGUOUS',
} as const;
export type EReceiptFieldStatus = EReceiptFieldStatusValue;

export type TReceiptDataField<T> = {
  value?: T;
  status: EReceiptFieldStatus;
};

export type TReceiptDataError = FinanceTReceiptDataError;

export type TReceiptData = {
  fine: TReceiptDataField<number>;
  payer: TReceiptDataField<string>;
  barcode: TReceiptDataField<string>;
  due_date: TReceiptDataField<Date>;
  discount: TReceiptDataField<number>;
  category: TReceiptDataField<string>;
  interest: TReceiptDataField<number>;
  description: TReceiptDataField<string>;
  paid_amount: TReceiptDataField<number>;
  beneficiary: TReceiptDataField<string>;
  payment_date: TReceiptDataField<Date>;
  total_charges: TReceiptDataField<number>;
  authentication: TReceiptDataField<string>;
  transaction_id: TReceiptDataField<string>;
  effective_payer: TReceiptDataField<string>;
  document_amount: TReceiptDataField<number>;
  source_institution: TReceiptDataField<string>;
  destination_institution: TReceiptDataField<string>;
};

export type TReceiptFilter = TBaseFilter;

export type TReceipt = Receipt;

export type TReceiptUpload = Omit<Receipt, 'file_name' | 'file_type' | 'extracted_data'> & {
  data?: TReceiptData;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  error_message?: string;
};

export type TReceiptBatch = {
  total: number;
  items: Array<TReceiptUpload>;
  failed: number;
  received: number;
  processed: number;
  processing: number;
};

export type TReceiptConfirm = {
  id: string;
  fine?: number;
  payer?: string;
  barcode?: string;
  due_date?: Date;
  category: string;
  discount?: number;
  interest?: number;
  beneficiary: string;
  description?: string;
  paid_amount: number;
  payment_date?: Date;
  total_charges?: number;
  authentication?: string;
  transaction_id?: string;
  effective_payer?: string;
  document_amount?: number;
  source_institution: string;
  destination_institution?: string;
};

export type ReceiptApiNumber = FinanceReceiptApiNumber;
export type ReceiptApiDate = FinanceReceiptApiDate;
export type TReceiptApiDataField<T> = FinanceTReceiptApiDataField<T>;
export type TReceiptApiData = FinanceTReceiptApiData;
export type ReceiptApiData = FinanceReceiptApiData;

export type TReceiptJsonData = Omit<
  TReceiptData,
  'due_date' | 'payment_date'
> & {
  due_date: TReceiptDataField<string>;
  payment_date: TReceiptDataField<string>;
};

export type ReceiptJson = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  created_at: string;
  updated_at?: string;
  processing_status: EReceiptProcessingStatus;
  extracted_data: TReceiptJsonData;
};

export type ReceiptApiList = FinanceReceiptApiList;
export type ReceiptJsonList =
  | Array<ReceiptJson>
  | TPaginatedListResponse<ReceiptJson>;
export type ReceiptDomainList =
  | Array<Receipt>
  | TPaginatedListResponse<Receipt>;

export type ReceiptUploadApiData = FinanceReceiptUploadApiData;

export type ReceiptUploadJson = {
  id: string;
  file_size: string;
  created_at: string;
  updated_at?: string;
  processing_status: EReceiptProcessingStatus;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  error_message?: string;
  data?: TReceiptJsonData;
};

export type ReceiptBatchApiData = FinanceReceiptBatchApiData;

export type ReceiptBatchJson = Omit<TReceiptBatch, 'items'> & {
  items: Array<ReceiptUploadJson>;
};

export type ReceiptConfirmJson = Omit<TReceiptConfirm, 'due_date' | 'payment_date'> & {
  due_date?: string;
  payment_date?: string;
};

export type ReceiptConfirmApiRequest = FinanceReceiptConfirmApiRequest;
