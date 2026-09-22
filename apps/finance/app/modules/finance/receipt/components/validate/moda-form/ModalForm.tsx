import { TReceiptConfirm } from '@/app/modules/finance/receipt';
import {
  Form ,
  type FormProps ,
  type FormValidation ,
  useAlert,
} from '@machado-repo/ui';
import { useCallback ,useMemo } from 'react';

type ModalFormProps = {
  item: TReceiptConfirm;
  onSubmit: (data: TReceiptConfirm) => void;
  onCancel: () => void;

};
export default function ModalForm({
  item ,
  onSubmit ,
  onCancel ,
}: ModalFormProps) {

  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => {
    const data: Record<string, string> = {};
    Object.entries(item).forEach(([key, value]) => {
      if(!value) {
        data[key] = '';
        return;
      }
      if(value instanceof Date) {
        const currentValue = value.toISOString().split('T')[0];
        data[key] = !currentValue ? '' : currentValue;
        return;
      }
      data[key] = String(value);
    })
    return data;
  } ,[item]);

  const fields: FormProps['fields'] = useMemo(() => {
    return [
      {
        type: 'text' ,
        name: 'payer' ,
        label: 'finance.receipt.payee.label' ,
        placeholder: 'finance.receipt.payee.placeholder' ,
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
        value: initialValues.payment_date ?? '',
        disabled: Boolean(initialValues.payment_date) ,
        required: true ,
      } ,
      {
        type: 'money' ,
        name: 'paid_amount' ,
        label: 'finance.payment.amount.label' ,
        placeholder: 'finance.payment.amount.placeholder' ,
        value: initialValues.paid_amount ?? '',
        disabled: Boolean(initialValues.paid_amount) ,
        required: true ,
      }
    ];
  } ,[initialValues]);

  const handleOnSuccess = (data: Record<string, string>) => {
    const dataItem = { ...item };
    if(data.payer) {
      dataItem.payer = dataItem.payer !== data.payer ? data.payer : dataItem.payer;
    }
    if(data.beneficiary) {
      dataItem.beneficiary = data.beneficiary !== dataItem.beneficiary ? data.beneficiary : dataItem.beneficiary;
    }
    if(data.source_institution) {
      dataItem.source_institution = data.source_institution !== dataItem.source_institution ? data.source_institution : dataItem.source_institution;
    }
    if(data.destination_institution) {
      dataItem.destination_institution = data.destination_institution !== dataItem.destination_institution ? data.destination_institution : dataItem.destination_institution;
    }
    if(data.payment_date) {
      const validDate = new Date(data.payment_date);
      if(!isNaN(validDate.getTime())) {
        dataItem.payment_date = dataItem.payment_date !== validDate ? validDate : dataItem.payment_date;
      }
    }
    if(data.paid_amount) {
      const validAmount = Number(data.paid_amount);
      if(!isNaN(validAmount)) {
        dataItem.paid_amount = dataItem.paid_amount !== validAmount ? validAmount : dataItem.paid_amount;
      }
    }
    onSubmit(dataItem);
  }

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error' ,
      message: validation.errorMessage ?? 'auth.form.validation.error' ,
      position: 'top-right' ,
    });
  } ,[showAlert]);

  return (
    <div>
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
    </div>
  );
}