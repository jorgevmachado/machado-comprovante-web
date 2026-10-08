import { DateVO } from '@machado-repo/shared';

import type { EReceiptProcessingStatus, TReceiptData } from '../types';

export type ReceiptProps = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  created_at: Date;
  updated_at?: Date;
  extracted_data: TReceiptData;
  processing_status: EReceiptProcessingStatus;
};

export class Receipt {
  public readonly id: string;
  public readonly file_name: string;
  public readonly file_type: string;
  public readonly file_size: string;
  public readonly created_at: Date;
  public readonly updated_at: Date | undefined;
  public readonly extracted_data: TReceiptData;
  public readonly processing_status: EReceiptProcessingStatus;

  private constructor(props: ReceiptProps) {
    this.id = props.id;
    this.file_name = props.file_name;
    this.file_type = props.file_type;
    this.file_size = props.file_size;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.extracted_data = props.extracted_data;
    this.processing_status = props.processing_status;
  }

  public static create(props: ReceiptProps): Receipt {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid receipt created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid receipt updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Receipt(props);
  }
}
