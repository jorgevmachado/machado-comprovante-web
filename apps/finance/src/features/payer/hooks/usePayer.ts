'use client';

import { useCallback, useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { type TAlertActionOptions, useAlert, useLoading } from '@machado-repo/ui';

import { payerService } from '../services/payer.service';
import type { TPayer, TPayerFilter, TPayerPersist } from '../types';

type UsePayerActionOptions = TAlertActionOptions;

export type UsePayerReturn = {
  meta?: TPaginatedMeta;
  items: Array<TPayer>;
  persist: (item: TPayerPersist, options?: UsePayerActionOptions) => Promise<TPayer | undefined>;
  refresh: () => Promise<void>;
  goToPage: (
    page: number,
    params?: TPayerFilter,
    options?: UsePayerActionOptions,
  ) => Promise<void>;
  isLoading: boolean;
  fetchList: (params?: TPayerFilter, options?: UsePayerActionOptions) => Promise<void>;
};

const messagePrefix = 'finance.payer';

export default function usePayer(): UsePayerReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TPayer>>([]);

  const fetchList = useCallback(async (
    params?: TPayerFilter,
    options?: UsePayerActionOptions,
  ) => {
    await execute(async () => {
      const filter: TPayerFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {}),
      };
      const response = await payerService.fetchList(filter);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });

      const instance = response.instance;
      if (!instance) {
        return;
      }

      if (Array.isArray(instance)) {
        setItems(instance);
        return;
      }

      setMeta(instance.meta);
      setItems(instance.items);
    });
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (
    page: number,
    params?: TPayerFilter,
    options?: UsePayerActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: page.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }

    await fetchList();
  }, [fetchList, isLoading]);

  const create = useCallback(async (item: TPayerPersist, options?: UsePayerActionOptions) => {
    return execute(async () => {
      const response = await payerService.create(item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'create',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const update = useCallback(async (item: TPayerPersist, options?: UsePayerActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.payer.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }

    return execute(async () => {
      const response = await payerService.update(identifier, item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (item: TPayerPersist, options?: UsePayerActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList };
}
