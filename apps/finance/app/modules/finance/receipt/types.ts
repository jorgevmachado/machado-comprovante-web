import type { TBaseFilter } from '@machado-repo/ui';

export enum EReceiptProcessingStatus {
  FAILED = 'FAILED',
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  PROCESSING = 'PROCESSING',
}


export enum EReceiptFieldStatus {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  AMBIGUOUS = 'AMBIGUOUS',
}

export type TReceiptDataField<T> = {
  value?: T;
  status: EReceiptFieldStatus;
}

type TReceiptDataError = {
  field: string;
  status: EReceiptFieldStatus;
}

export type TReceiptData = {
  fine: TReceiptDataField<number>
  payer: TReceiptDataField<string>
  barcode: TReceiptDataField<string>
  due_date: TReceiptDataField<Date>
  discount: TReceiptDataField<number>
  category: TReceiptDataField<string>;
  interest: TReceiptDataField<number>
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
}

export type TReceiptFilter = TBaseFilter;

export type TReceipt = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  created_at: Date;
  updated_at?: Date;
  extracted_data: TReceiptData;
  processing_status: EReceiptProcessingStatus;
}

export type TReceiptUpload = Omit<TReceipt, 'file_name'| 'file_type'| 'extracted_data'> & {
  data?: TReceiptData;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  error_message?: string;
}

export type TReceiptBatch = {
  total: number;
  items: Array<TReceiptUpload>;
  failed: number;
  received: number;
  processed: number;
  processing: number;
}

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
}

