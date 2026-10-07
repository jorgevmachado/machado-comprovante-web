import { useCallback ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { TAlertActionOptions ,useAlert ,useLoading } from '@machado-repo/ui';

import {
  TPayer ,
  TPayerFilter,
  TPayerPersist
} from '@/app/modules/finance/payer';
import { payerService } from '@/app/modules/finance/payer/services';

type UsePayerActionOptions = TAlertActionOptions;

export type UsePayerReturn = {
    meta?: TPaginatedMeta;
    items: Array<TPayer>;
    persist: (item: TPayerPersist, options?: UsePayerActionOptions) => Promise<TPayer | undefined>;
    refresh: () => Promise<void>;
    goToPage: (page: number, params?: TPayerFilter, options?: UsePayerActionOptions) => Promise<void>;
    isLoading: boolean;
    fetchList: (params?: TPayerFilter, options?: UsePayerActionOptions) => Promise<void>;
}

const messagePrefix = 'finance.payer';

export default function usePayer(): UsePayerReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TPayer>>([]);

  const fetchList = useCallback(async (params?: TPayerFilter, options?: UsePayerActionOptions) => {
    await execute(async () => {
      const filter: TPayerFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {})
      };
      const response = await payerService.fetchList(filter);
      const instance = response.instance;
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      if(!instance){
        return;
      }

      if(Array.isArray(instance)) {
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

  const goToPage = useCallback(async (page: number, params?: TPayerFilter, options?: UsePayerActionOptions) => {
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
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      });
      if(response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const update = useCallback(async (item: TPayerPersist, options?: UsePayerActionOptions) => {
    const identifier = item.id;
    if(!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.category.update.error.no_id',
        messagePrefix: messagePrefix,
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
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      });
      if(response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (item: TPayerPersist, options?: UsePayerActionOptions) => {
    const identifier = item.id;
    if(!identifier) {
      return await create(item, options);
    }
    return await update(item, options);
  }, [create, update]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList };
}