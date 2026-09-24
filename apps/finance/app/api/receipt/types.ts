import {
  TReceipt ,
  TReceiptData ,
  TReceiptDataField,
} from '@/app/modules/finance/receipt';

export type TReceiptExtractedDataResponse = Omit<TReceiptData, 'due_date' | 'payment_date'> & {
  due_date: TReceiptDataField<string>;
  payment_date: TReceiptDataField<string>;
}

export type TReceiptApiResponse = Omit<TReceipt, 'extracted_data'> & {
  extracted_data: TReceiptExtractedDataResponse;
}