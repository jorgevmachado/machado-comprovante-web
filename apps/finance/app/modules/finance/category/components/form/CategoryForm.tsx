'use client';
import { TCategory ,TCategoryPersist } from '@/app/modules/finance/category';
import {
  Form ,
  type FormProps ,
  type FormValidation ,
  useAlert ,
} from '@machado-repo/ui';
import { useCallback ,useMemo } from 'react';

type CategoryFormProps = {
  item?: TCategory;
  onCancel: () => void;
  onSubmit: (item: TCategoryPersist) => void;
}

export default function CategoryForm({
  item,
  onCancel,
  onSubmit
}: CategoryFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => {
    return {
      name: item?.name ?? '',
      description: item?.description ?? '',
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
      {
        type: 'description' ,
        name: 'description' ,
        value: initialValues.description ?? ''
      } ,
    ]
  },[initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const category: TCategoryPersist = {
      id: item?.id,
      name: data.name as string,
      description: data.description,
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