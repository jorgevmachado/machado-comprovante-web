import React from 'react';

import type { BaseInputProps } from '../../../types';

import type { InputProps } from '../../input';
import type { TextareaProps } from '../../textarea';

export type TFormTextFieldType = 'text' | 'name' | 'fullname';

export type TFormTextAreaFieldType = 'description';

export type TFormCredentialFieldType = 'password' | 'password_confirmation';

export type TFormContactFieldType = 'email' | 'phone';

export type TFormFieldType =
  | TFormTextFieldType
  | TFormTextAreaFieldType
  | TFormCredentialFieldType
  | TFormContactFieldType;

export type TFormFieldPresentation = Pick<
  BaseInputProps,
  | 'size'
  | 'variant'
  | 'fullWidth'
  | 'leadingIcon'
  | 'trailingIcon'
  | 'helperText'
  | 'loadingText'
  | 'isLoading'
  | 'showClearButton'
  | 'uppercaseLabel'
  | 'switchLanguage'
  | 'helperClassName'
  | 'containerClassName'
  | 'inputWrapperClassName'
  | 'clearButtonAriaLabel'
  | 'onClear'
>;

export type TFormInputPresentation = TFormFieldPresentation & Pick<InputProps, 'mask' | 'minLength' | 'maxLength'>;

export type TFormTextareaPresentation = TFormFieldPresentation & Pick<
  TextareaProps,
  | 'rows'
  | 'minLength'
  | 'maxLength'
  | 'showCharacterCount'
>;

export type TFormValidation = {
  matchField?: string;
  errorMessage?: string;
}

type TBaseFormField = {
  name: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  validation?: TFormValidation;
  placeholder?: string;
  validatorConfig?: Record<string, unknown>;
}

export type TFormInputField = TBaseFormField & {
  type: TFormTextFieldType | TFormCredentialFieldType | TFormContactFieldType;
  presentation?: TFormInputPresentation;
}

export type TFormTextareaField = TBaseFormField & {
  type: TFormTextAreaFieldType;
  presentation?: TFormTextareaPresentation;
}

export type TFormField = TFormInputField | TFormTextareaField;

export type TFormFieldController = {
  value: string;
  isInvalid?: boolean;
  onValueBlur?: (value: string, name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errorMessage?: string;
  onValueChange?: (value: string, name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export type FormFieldProps = TFormField & TFormFieldController;