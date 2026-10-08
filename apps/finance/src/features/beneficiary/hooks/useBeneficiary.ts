'use client';

import { useCallback, useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { type TAlertActionOptions, useAlert, useLoading } from '@machado-repo/ui';

import { beneficiaryService } from '../services/beneficiary.service';
import type {
  TBeneficiary ,
  TBeneficiaryFilter ,
  TBeneficiaryPersist,
} from '../types';

type UseBeneficiaryActionOptions = TAlertActionOptions;

export type UseBeneficiaryReturn = {
  meta?: TPaginatedMeta;
  items: Array<TBeneficiary>;
  persist: (item: TBeneficiaryPersist, options?: UseBeneficiaryActionOptions) => Promise<TBeneficiary | undefined>;
  refresh: () => Promise<void>;
  goToPage: (
    page: number,
    params?: TBeneficiaryFilter,
    options?: UseBeneficiaryActionOptions,
  ) => Promise<void>;
  isLoading: boolean;
  fetchList: (
    params?: TBeneficiaryFilter,
    options?: UseBeneficiaryActionOptions,
  ) => Promise<void>;
};

const messagePrefix = 'finance.beneficiary';

export default function useBeneficiary(): UseBeneficiaryReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TBeneficiary>>([]);

  const fetchList = useCallback(async (
    params?: TBeneficiaryFilter,
    options?: UseBeneficiaryActionOptions,
  ) => {
    await execute(async () => {
      const filter: TBeneficiaryFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {}),
      };
      const response = await beneficiaryService.getBeneficiaries(filter);
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
    params?: TBeneficiaryFilter,
    options?: UseBeneficiaryActionOptions,
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

  const create = useCallback(async (item: TBeneficiaryPersist, options?: UseBeneficiaryActionOptions) => {
    return execute(async () => {
      const response = await beneficiaryService.create(item);
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

  const update = useCallback(async (item: TBeneficiaryPersist, options?: UseBeneficiaryActionOptions) => {
    const identifier = item.id;
    if(!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.beneficiary.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }
    return execute(async () => {
      const response = await beneficiaryService.update(identifier, item);
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

  const persist = useCallback(async (item: TBeneficiaryPersist, options?: UseBeneficiaryActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  return { meta, goToPage, persist, refresh, isLoading, items, fetchList };
}
