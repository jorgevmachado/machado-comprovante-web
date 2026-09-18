import React from 'react';

import type { TSize, TTone } from '@machado-repo/theme';
import type { TIcon, TIconGroup } from '@machado-repo/icons';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode | TIcon;
  size?: TSize;
  tone?: TTone;
  group?: TIconGroup;
  withDefault?: boolean;
  iconClassName?: string;
}