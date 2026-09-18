import React from 'react';

import type {
  FormCommonValidationRules ,
  FormValidation ,
  FormValidationRules,
} from './validator';
import type { FormFieldProps } from './field';
import type { FormActionsProps } from './actions';
import type { FormLayoutProps } from './layout';

export type FormProps = Omit<React.FormHTMLAttributes<HTMLFormElement> ,'onSubmit' | 'onError'> & {
  rules?: FormValidationRules;
  fields: Array<Omit<FormFieldProps, 'name'> & { name?: string; }>;
  layout?: Omit<FormLayoutProps, 'children'>;
  actions?: FormActionsProps;
  onError?: (validation: FormValidation) => void;
  onSuccess?: (data: Record<string ,string>) => void;
  commonRules?: FormCommonValidationRules;
  initialValues: Record<string ,string>;
}