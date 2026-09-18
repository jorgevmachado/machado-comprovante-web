import { ButtonHTMLAttributes ,ReactNode } from 'react';

import type { TIcon } from '@machado-repo/icons';
import type { TButtonAppearance, TButtonSize, TTone  } from '@machado-repo/theme';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  tone?: TTone;
  size?: TButtonSize;
  children?: ReactNode;
  iconLeft?: ReactNode | TIcon;
  iconRight?: ReactNode | TIcon;
  fullWidth?: boolean;
  isLoading?: boolean;
  appearance?: TButtonAppearance;
  loadingText?: string;
};