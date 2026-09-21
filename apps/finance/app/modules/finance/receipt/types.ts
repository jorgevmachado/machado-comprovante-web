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

type TReceiptDataField<T> = {
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
  interest: TReceiptDataField<number>
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

export type TReceiptUpload = {
  id: string;
  data?: TReceiptData;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  file_size: number;
  error_message?: string;
  processing_status: EReceiptProcessingStatus;
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
  discount?: number;
  interest?: number;
  beneficiary: string;
  paid_amount: number;
  payment_date: Date;
  total_charges?: number;
  authentication?: string;
  transaction_id?: string;
  effective_payer?: string;
  document_amount?: number;
  source_institution: string;
  destination_institution?: string;
}