import type { TAlertVariant } from '@machado-repo/theme';

export const ALERT_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export type TAlertPosition = typeof ALERT_POSITIONS[number];

export type TAlert = {
  id: string;
  title?: string;
  message: string;
  variant: TAlertVariant;
  position?: TAlertPosition;
}

export type TShowAlert = {
  title?: string;
  message: string;
  variant?: TAlertVariant;
  duration?: number;
  position?: TAlertPosition;
}