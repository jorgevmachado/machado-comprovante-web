'use client';
import React ,{ useMemo } from 'react';

import { I18nProvider, type TLocalesFiles, mergeLocaleFiles } from '@machado-repo/i18n';
import { AlertProvider, BreadcrumbProvider, filterLocales, formLocales } from '../components';

type UiProviderProps = {
  locales?: TLocalesFiles;
  children: React.ReactNode;
}

export default function UIProvider({
  locales,
  children,
}: UiProviderProps) {

  const mergedLocaleFiles = useMemo(() => {
    const listLocales: Array<TLocalesFiles> = [];
    listLocales.push(filterLocales);
    listLocales.push(formLocales);
    if (locales) {
      listLocales.push(locales);
    }
    return mergeLocaleFiles(listLocales);
  }, [locales]);

  return (
    <I18nProvider locales={mergedLocaleFiles}>
      <AlertProvider>
        <BreadcrumbProvider>
          {children}
        </BreadcrumbProvider>
      </AlertProvider>
    </I18nProvider>
  );
}