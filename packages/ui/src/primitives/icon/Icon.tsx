import React, { useMemo } from 'react';

import { TIcon, getIcon } from '@machado-repo/icons';

import type { IconProps } from './types';

export default function Icon({
  icon,
  size,
  tone,
  group,
  className,
  withDefault,
  iconClassName ,
  ...props
}: IconProps) {

  const ariaLabel = useMemo(() => {
    if(props['aria-label']) {
      return props['aria-label'];
    }
    if (typeof icon === 'string') {
      return icon;
    }
    return undefined;
  }, [icon, props['aria-label']]);

  const currentData = useMemo(() => {
    if (typeof icon === 'string') {
      return getIcon({ name: icon as TIcon, size, tone, group, className: iconClassName, withDefault });
    }
    return {
      icon,
      group,
    }
  }, [icon, size, tone, group, iconClassName, withDefault]);

  const dataTestId = useMemo(() => {
    if (typeof icon === 'string') {
      return `icon-${currentData.group}-${icon}`;
    }

    return 'icon-custom';
  }, [icon, currentData.group]);

  return (
    <span
      {...props}
      className={ `inline-block align-top ${className ?? ''}` }
      aria-label={ ariaLabel }
      data-group={ currentData.group }
      data-testid={ dataTestId }
    >
      { currentData.icon }
    </span>
  );
};