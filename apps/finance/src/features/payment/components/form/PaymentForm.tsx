import { useCallback ,useMemo } from 'react';

import { DateVO ,Money } from '@machado-repo/shared';

import {
  Form ,
  type FormProps ,
  type FormValidation ,
  useAlert ,
} from '@machado-repo/ui';

import type { TPayment, TPaymentPersist } from '../../types';

type PaymentFormProps = {
  item: TPayment;
  onSubmit: (item: TPaymentPersist) => void;
  onCancel: () => void;
}
export default function PaymentForm({
  item,
  onSubmit,
  onCancel
}: PaymentFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => {
    const data: Record<string, string> = {
      payer: item.receipt.payer ?? '',
      amount: String(item.amount ?? ''),
      beneficiary: item.beneficiary.name ?? '',
      payment_date: item.payment_date ? DateVO.format.dateToDateString(item.payment_date) ?? '' : '',
      source_institution: item.source_institution.name ?? '',
      destination_institution: item.destination_institution?.name ?? '',
    };
    return data;
  }, [item]);

  const fields: FormProps['fields'] = useMemo(() => {
    const paymentDate = !initialValues.payment_date
      ? undefined
      : DateVO.format.dateToDateString(initialValues.payment_date);

    const paidAmount = !initialValues.amount || initialValues.amount === '0'
      ? undefined
      : initialValues.amount;

    return [
      {
        type: 'text' ,
        name: 'payer' ,
        label: 'finance.receipt.payer.label' ,
        placeholder: 'finance.receipt.payer.placeholder' ,
        value: initialValues.payer ?? '',
      } ,
      {
        type: 'text' ,
        name: 'beneficiary' ,
        label: 'finance.beneficiary.name.label' ,
        placeholder: 'finance.beneficiary.name.placeholder' ,
        required: true ,
        value: initialValues.beneficiary ?? ''
      } ,
      {
        type: 'text' ,
        name: 'source_institution' ,
        label: 'finance.payment.source_institution.label' ,
        placeholder: 'finance.payment.source_institution.placeholder' ,
        value: initialValues.source_institution ?? '',
        required: true ,
      } ,
      {
        type: 'text' ,
        name: 'destination_institution' ,
        label: 'finance.payment.destination_institution.label' ,
        placeholder: 'finance.payment.destination_institution.placeholder' ,
        value: initialValues.destination_institution ?? '',
      } ,
      {
        type: 'date' ,
        name: 'payment_date' ,
        label: 'finance.payment.date.label' ,
        placeholder: 'finance.payment.date.placeholder' ,
        value: paymentDate ?? '',
        required: true ,
      } ,
      {
        type: 'money' ,
        name: 'amount' ,
        label: 'finance.payment.amount.label' ,
        placeholder: 'finance.payment.amount.placeholder' ,
        value: paidAmount ?? '',
        required: true ,
      }
    ]
  },[initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const paymentData: TPaymentPersist = {
      id: item.id,
    };
    if(data.payer) {
      paymentData.payer = paymentData.payer !== data.payer ? data.payer : paymentData.payer;
    }

    if(data.beneficiary) {
      paymentData.beneficiary = data.beneficiary !== paymentData.beneficiary ? data.beneficiary : paymentData.beneficiary;
    }

    if(data.source_institution) {
      paymentData.source_institution = data.source_institution !== paymentData.source_institution ? data.source_institution : paymentData.source_institution;
    }

    if(data.destination_institution) {
      paymentData.destination_institution = data.destination_institution !== paymentData.destination_institution ? data.destination_institution : paymentData.destination_institution;
    }

    if(data.amount) {
      const validAmount = Money.tryCreate(data.amount).instance.valueNumber;
      if(!isNaN(validAmount)) {
        paymentData.amount = validAmount;
      }
    }

    if(data.payment_date) {
      const validDate = new Date(data.payment_date);
      if(!isNaN(validDate.getTime())) {
        paymentData.payment_date = paymentData.payment_date !== validDate ? validDate : paymentData.payment_date;
      }
    }

    onSubmit(paymentData);
  },[item, onSubmit]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error' ,
      message: validation.errorMessage ?? 'auth.form.validation.error' ,
      position: 'top-right' ,
    });
  } ,[showAlert]);

  return (
    <Form
      fields={ fields }
      actions={ {
        submit: {
          children: 'form.action.save' ,
          fullWidth: true ,
        } ,
        cancel: {
          children: 'form.action.cancel' ,
          fullWidth: true ,
          onClick: () => onCancel() ,
        },
      } }
      onError={ handleOnError }
      onSuccess={ handleOnSuccess }
      className="space-y-4"
      initialValues={ initialValues }
    />
  );
}