'use client';

import { useCallback, useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { type TAlertActionOptions, useAlert, useLoading } from '@machado-repo/ui';

import { institutionService } from '../services/institution.service';
import type {
  TInstitution ,
  TInstitutionFilter ,
  TInstitutionPersist,
} from '../types';

type UseInstitutionActionOptions = TAlertActionOptions;

export type UseInstitutionReturn = {
  meta?: TPaginatedMeta;
  items: Array<TInstitution>;
  persist: (item: TInstitutionPersist, options?: UseInstitutionActionOptions) => Promise<TInstitution | undefined>;
  refresh: () => Promise<void>;
  goToPage: (
    page: number,
    params?: TInstitutionFilter,
    options?: UseInstitutionActionOptions,
  ) => Promise<void>;
  isLoading: boolean;
  fetchList: (
    params?: TInstitutionFilter,
    options?: UseInstitutionActionOptions,
  ) => Promise<void>;
};

const messagePrefix = 'finance.institution';

export default function useInstitution(): UseInstitutionReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TInstitution>>([]);

  const fetchList = useCallback(async (
    params?: TInstitutionFilter,
    options?: UseInstitutionActionOptions,
  ) => {
    await execute(async () => {
      const response = await institutionService.getInstitutions(params);
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

  const goToPage = useCallback(async (
    page: number,
    params?: TInstitutionFilter,
    options?: UseInstitutionActionOptions,
  ) => {
    const targetPage = Math.min(Math.max(page, 1), Math.max(meta?.total_pages ?? 1, 1));

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: targetPage.toString() }, options);
  }, [fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }

    await fetchList();
  }, [fetchList, isLoading]);

  const create = useCallback(async (item: TInstitutionPersist, options?: UseInstitutionActionOptions) => {
    return execute(async () => {
      const response = await institutionService.create(item);
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
  },[execute, executeServiceAlert, refresh]);

  const update = useCallback(async (item: TInstitutionPersist, options?: UseInstitutionActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.institution.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }
    return execute(async () => {
      const response = await institutionService.update(identifier, item);
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
  },[execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (item: TInstitutionPersist, options?: UseInstitutionActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  },[update, create]);

  return { meta, goToPage, isLoading, items, fetchList, refresh, persist };
}
