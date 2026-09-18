import React, { useMemo } from 'react';

import { useTranslationResolver } from '../../../lang';

import Input from '../../input';
import Textarea from '../../textarea';

import { FORM_FIELD_DEFINITIONS } from './definitions';

import type { FormFieldProps } from './types';

const FormField = ({
  type,
  name,
  label,
  value,
  hidden,
  disabled,
  isInvalid,
  onValueBlur,
  placeholder,
  errorMessage,
  presentation,
  onValueChange
}: FormFieldProps) => {
  const definition = FORM_FIELD_DEFINITIONS[type];
  const { resolve: resolveTranslation } = useTranslationResolver();

  const fieldLabel = useMemo(() => resolveTranslation(label), [label, resolveTranslation]);
  const fieldPlaceholder = useMemo(() => resolveTranslation(placeholder), [placeholder, resolveTranslation]);
  const fieldErrorMessage = useMemo(() => {
    if(!errorMessage) {
      return undefined;
    }
    return resolveTranslation(errorMessage);
  }, [errorMessage, resolveTranslation]);

  if (definition.component === 'textarea') {
    return (
      <Textarea
        {...presentation}
        name={name}
        label={fieldLabel}
        value={value}
        hidden={hidden}
        disabled={disabled}
        isInvalid={isInvalid}
        placeholder={fieldPlaceholder}
        onValueBlur={onValueBlur}
        errorMessage={fieldErrorMessage}
        onValueChange={onValueChange}
      />
    )
  }

  return (
    <Input
      {...presentation}
      name={name}
      type={definition.inputType}
      label={fieldLabel}
      value={value}
      hidden={hidden}
      disabled={disabled}
      isInvalid={isInvalid}
      placeholder={fieldPlaceholder}
      onValueBlur={onValueBlur}
      errorMessage={fieldErrorMessage}
      onValueChange={onValueChange}
    />
  )
}

FormField.displayName = 'FormField';

export default FormField;