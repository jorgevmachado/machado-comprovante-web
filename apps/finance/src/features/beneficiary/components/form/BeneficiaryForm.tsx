'use client';

import { useCallback, useMemo } from 'react';

import {
  Form,
  type FormProps,
  type FormValidation,
  useAlert,
} from '@machado-repo/ui';

import type { TBeneficiary, TBeneficiaryPersist } from '../../types';

type BeneficiaryFormProps = {
  item?: TBeneficiary;
  onCancel: () => void;
  onSubmit: (item: TBeneficiaryPersist) => void;
};

export default function BeneficiaryForm({ item, onCancel, onSubmit }: BeneficiaryFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    name: item?.name ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'finance.beneficiary.name.label',
      placeholder: 'finance.beneficiary.name.placeholder',
      required: true,
      value: initialValues.name ?? '',
    },
  ], [initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    onSubmit({
      id: item?.id,
      name: data.name ?? '',
    });
  }, [item, onSubmit]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'auth.form.validation.error',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <Form
      fields={fields}
      actions={{
        submit: {
          children: 'form.action.save',
          fullWidth: true,
        },
        cancel: {
          children: 'form.action.cancel',
          fullWidth: true,
          onClick: onCancel,
        },
      }}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      className="space-y-4"
      initialValues={initialValues}
    />
  );
}
