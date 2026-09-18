import { ReactNode } from 'react';
import type { SupportedLocale } from '@machado-repo/i18n';
import type { TIcon } from '@machado-repo/icons';
import type { TInputSize, TInputVariant } from '@machado-repo/theme';

export type BaseInputProps = {
  key?: string;
  name: string;
  size?: TInputSize;
  label?: string;
  hidden?: boolean;
  onClear?: () => void;
  variant?: TInputVariant;
  isInvalid?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  loadingText?: string;
  leadingIcon?: ReactNode | TIcon;
  trailingIcon?: ReactNode | TIcon;
  errorMessage?: string;
  uppercaseLabel?: boolean;
  switchLanguage?: SupportedLocale;
  helperClassName?: string;
  showClearButton?: boolean;
  containerClassName?: string;
  clearButtonAriaLabel?: string;
  inputWrapperClassName?: string;
}