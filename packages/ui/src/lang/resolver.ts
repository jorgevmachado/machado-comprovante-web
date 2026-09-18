import React, { useCallback } from 'react';

import { useAppTranslation, isTranslationValue, parseTranslationMessage } from '@machado-repo/i18n';

type InvalidElement = {
  children?: React.ReactNode;
}

type UseTranslationResolver = {
  resolve<T,>(value: T, values?: Record<string, unknown>): T | string;
  resolveChildren: (child?: React.ReactNode, currentDepth?: number) => React.ReactNode;
}

export function useTranslationResolver(): UseTranslationResolver {
  const { t } = useAppTranslation();

  const resolve = useCallback(<T,>(value: T, values?: Record<string, unknown>): T | string => {
    if(!isTranslationValue(value)) {
      return value;
    }

    const translated = parseTranslationMessage(value);

    if(!translated) {
      return t(value, values);
    }

    return t(translated.key, { ...translated.params, ...values });
  }, [t]);

  const resolveChildren = useCallback((child?: React.ReactNode, currentDepth: number = 0): React.ReactNode => {
    if(typeof child === 'string') {
      return resolve(child);
    }

    if(currentDepth <= 0 || !React.isValidElement<InvalidElement>(child)) {
      return child;
    }

    return React.cloneElement(
      child,
      {},
      React.Children.map(
        child.props.children,
        (nestedChild) => resolveChildren(nestedChild, currentDepth - 1)
      )
    );
  },[resolve])

  return { resolve, resolveChildren };
}