import { useCallback ,useMemo } from 'react';

import {
  Form ,
  type FormProps ,
  type FormValidation ,
  useAlert ,
} from '@machado-repo/ui';

import {
  EReceiptFieldStatus ,
  TReceiptConfirm ,
  TReceiptData ,
} from '@/app/modules/finance/receipt';

type ReceiptInfoConfirmProps = {
  item: TReceiptConfirm;
  onSubmit: (dataItem: TReceiptConfirm, data: TReceiptData) => void;
  onCancel: () => void;
}

const initialReceiptData: TReceiptData = {
  fine: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  payer: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  barcode: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  due_date: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  discount: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  interest: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  paid_amount: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  beneficiary: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  payment_date: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  total_charges: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  authentication: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  transaction_id: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  effective_payer: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  document_amount: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  source_institution: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
  destination_institution: {
    value: undefined,
    status: EReceiptFieldStatus.NOT_FOUND
  },
};

export default function ReceiptInfoConfirm({ item, onSubmit, onCancel }: ReceiptInfoConfirmProps) {
  const { showAlert } = useAlert();

  const convertDateToDateString = useCallback((date?: Date) => {
    if(!date) {
      return undefined;
    }

    const newDate = new Date(date);

    if(isNaN(newDate.getTime())) {
      return undefined;
    }

    return newDate.toISOString().split('T')[0];
  },[])

  const initialValues: Record<string, string> = useMemo(() => {
    const data: Record<string, string> = {
      id: item.id,
      fine: String(item.fine ?? ''),
      payer: String(item.payer ?? ''),
      barcode: String(item.barcode ?? ''),
      due_date: item.due_date ? convertDateToDateString(item.due_date) ?? '' : '',
      discount: String(item.discount ?? ''),
      interest: String(item.interest ?? ''),
      beneficiary: String(item.beneficiary ?? ''),
      paid_amount: String(item.paid_amount ?? ''),
      payment_date: item.payment_date ? convertDateToDateString(item.payment_date) ?? '' : '',
      total_charges: String(item.total_charges ?? ''),
      authentication: String(item.authentication ?? ''),
      transaction_id: String(item.transaction_id ?? ''),
      effective_payer: String(item.effective_payer ?? ''),
      document_amount: String(item.document_amount ?? ''),
      source_institution: String(item.source_institution ?? ''),
      destination_institution: String(item.destination_institution ?? ''),
    };
    return data;
  } ,[convertDateToDateString, item]);

  const fields: FormProps['fields'] = useMemo(() => {
    const paymentDate = !initialValues.payment_date ? undefined : convertDateToDateString(new Date(initialValues.payment_date));
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
        disabled: Boolean(paymentDate) ,
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
  } ,[convertDateToDateString, initialValues]);

  const convertToExtractedData = (item: Record<string, string>): TReceiptData => {
    const result = {...initialReceiptData};
    if(item['fine'] && item['fine'] !== '') {
      result.fine = {
        value: Number(item['fine']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['payer'] && item['payer'] !== '') {
      result.payer = {
        value: item['payer'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['barcode'] && item['barcode'] !== '') {
      result.barcode = {
        value: item['barcode'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['due_date'] && item['due_date'] !== '') {
      result.due_date = {
        value: new Date(item['due_date']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['discount'] && item['discount'] !== '') {
      result.discount = {
        value: Number(item['discount']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['interest'] && item['interest'] !== '') {
      result.interest = {
        value: Number(item['interest']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['paid_amount'] && item['paid_amount'] !== '') {
      result.paid_amount = {
        value: Number(item['paid_amount']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['beneficiary'] && item['beneficiary'] !== '') {
      result.beneficiary = {
        value: item['beneficiary'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['payment_date'] && item['payment_date'] !== '') {
      result.payment_date = {
        value: new Date(item['payment_date']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['total_charges'] && item['total_charges'] !== '') {
      result.total_charges = {
        value: Number(item['total_charges']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['authentication'] && item['authentication'] !== '') {
      result.authentication = {
        value: item['authentication'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['transaction_id'] && item['transaction_id'] !== '') {
      result.transaction_id = {
        value: item['transaction_id'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['effective_payer'] && item['effective_payer'] !== '') {
      result.effective_payer = {
        value: item['effective_payer'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['document_amount'] && item['document_amount'] !== '') {
      result.document_amount = {
        value: Number(item['document_amount']),
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['source_institution'] && item['source_institution'] !== '') {
      result.source_institution = {
        value: item['source_institution'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    if(item['destination_institution'] && item['destination_institution'] !== '') {
      result.destination_institution = {
        value: item['destination_institution'],
        status: EReceiptFieldStatus.FOUND
      }
    }
    return result;
  }

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
    const extractedData = convertToExtractedData(data)
    onSubmit(dataItem, extractedData);
  }

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