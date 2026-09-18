import type { TAlertVariant } from '@machado-repo/theme';

export type AlertProps = {
  title: string;
  visible?: boolean;
  onClose?: () => void;
  variant: TAlertVariant;
  className?: string;
  description?: string;
};