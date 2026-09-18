import type { DateLocale } from '@machado-repo/shared';

export type DatePickerProps = {
  value?: Date | null;
  locale?: DateLocale;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
};