import { DateVO } from '@machado-repo/shared';

import type { TPaymentReceipt, PaymentDependencies } from '../types';

export type PaymentProps = PaymentDependencies & {
  id: string;
  amount: number;
  payment_date: Date;
  receipt: TPaymentReceipt;
};

export class Payment {
  public readonly id: string;
  public readonly amount: number;
  public readonly payment_date: Date;
  public readonly receipt: TPaymentReceipt;
  public readonly category: PaymentDependencies['category'];
  public readonly beneficiary: PaymentDependencies['beneficiary'];
  public readonly source_institution: PaymentDependencies['source_institution'];
  public readonly destination_institution: PaymentDependencies['destination_institution'];

  private constructor(props: PaymentProps) {
    this.id = props.id;
    this.amount = props.amount;
    this.payment_date = props.payment_date;
    this.receipt = props.receipt;
    this.category = props.category;
    this.beneficiary = props.beneficiary;
    this.source_institution = props.source_institution;
    this.destination_institution = props.destination_institution;
  }

  public static create(props: PaymentProps): Payment {
    if (!Number.isFinite(props.amount)) {
      throw new Error(`Invalid payment amount: ${props.amount}`);
    }

    const paymentDateResult = DateVO.tryCreate(props.payment_date);
    if (paymentDateResult.isFailure) {
      throw new Error(`Invalid payment payment_date: ${paymentDateResult.error}`);
    }

    const receiptCreatedAtResult = DateVO.tryCreate(props.receipt.created_at);
    if (receiptCreatedAtResult.isFailure) {
      throw new Error(`Invalid payment receipt created_at: ${receiptCreatedAtResult.error}`);
    }

    if (props.receipt.updated_at) {
      const receiptUpdatedAtResult = DateVO.tryCreate(props.receipt.updated_at);
      if (receiptUpdatedAtResult.isFailure) {
        throw new Error(`Invalid payment receipt updated_at: ${receiptUpdatedAtResult.error}`);
      }
    }

    return new Payment(props);
  }
}
