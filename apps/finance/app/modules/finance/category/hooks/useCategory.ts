import { useCallback ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { TAlertActionOptions ,useAlert ,useLoading } from '@machado-repo/ui';

import {
  TCategory ,
  TCategoryFilter,
} from '@/app/modules/finance/category';
import { categoryService } from '@/app/modules/finance/category/services';

type UseCategoryActionOptions = TAlertActionOptions;

export type UseCategoryReturn = {
    meta?: TPaginatedMeta;
    items: Array<TCategory>;
    goToPage: (page: number, params?: TCategoryFilter, options?: UseCategoryActionOptions) => Promise<void>;
    isLoading: boolean;
    fetchList: (params?: TCategoryFilter, options?: UseCategoryActionOptions) => Promise<void>;
}

const messagePrefix = 'finance.category';

export default function useCategory(): UseCategoryReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TCategory>>([]);

  const fetchList = useCallback(async (params?: TCategoryFilter, options?: UseCategoryActionOptions) => {
    await execute(async () => {
      const filter: TCategoryFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {})
      };
      const response = await categoryService.fetchList(filter);
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

  const goToPage = useCallback(async (page: number, params?: TCategoryFilter, options?: UseCategoryActionOptions) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: page.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  return { meta, goToPage, isLoading, items, fetchList };
}