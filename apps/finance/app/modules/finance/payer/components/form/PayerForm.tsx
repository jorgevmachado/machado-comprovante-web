'use client';
import { useCallback ,useMemo } from 'react';

import {
  Form ,
  type FormProps ,
  type FormValidation ,
  useAlert ,
} from '@machado-repo/ui';

import { TPayer ,TPayerPersist } from '@/app/modules/finance/payer';

type PayerFormProps = {
  item?: TPayer;
  onCancel: () => void;
  onSubmit: (item: TPayerPersist) => void;
}

export default function PayerForm({
  item,
  onCancel,
  onSubmit
}: PayerFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => {
    return {
      name: item?.name ?? '',
    }
  }, [item]);

  const fields: FormProps['fields'] = useMemo(() => {
    return [
      {
        type: 'text' ,
        name: 'name' ,
        label: 'finance.category.name.label' ,
        placeholder: 'finance.category.name.placeholder' ,
        required: true ,
        value: initialValues.name ?? '',
      } ,
    ]
  },[initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const category: TPayerPersist = {
      id: item?.id,
      name: data.name as string,
    }
    onSubmit(category);
  }, [item, onSubmit]);

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
  )
}