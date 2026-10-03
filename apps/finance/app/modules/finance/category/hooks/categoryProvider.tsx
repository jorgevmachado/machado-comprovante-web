'use client';
import React ,{ useCallback ,useEffect ,useMemo ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { useAlert ,useLoading } from '@machado-repo/ui';

import {
  categoryService ,
  type TCategory ,
  TCategoryFilter ,
} from '@/app/modules/finance/category';

import {
  CategoryContext,
  type CategoryContextProps
} from './categoryContext';
import type {
  CategoryActionOptions
} from './types';


const messagePrefix = 'finance.category';

const CategoryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TCategory>>([]);
  const [categories, setCategories] = useState<Array<TCategory>>([]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const fetch = useCallback(async (params?: TCategoryFilter, options?: CategoryActionOptions) => {
    return execute(async () => {
      const filter: TCategoryFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {})
      };
      const response = await categoryService.fetchList(filter);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      return response.instance;
    });
  }, [execute, executeServiceAlert]);

  const fetchList = useCallback(async (params?: TCategoryFilter, options?: CategoryActionOptions) => {
    const instance =  await fetch(params, options);
    if(!instance){
      return;
    }
    if(Array.isArray(instance)) {
      setItems(instance);
      return;
    }

    setMeta(instance.meta);
    setItems(instance.items);
  }, [fetch]);

  const fetchCategories = useCallback(async (name?: string, options?: CategoryActionOptions) => {
    const params = !name ? undefined : { name };
    const instance =  await fetch(params, options);
    if(!instance){
      return;
    }

    if(Array.isArray(instance)) {
      setCategories(instance);
      return;
    }
  }, [fetch]);

  const goToPage = useCallback(async (page: number, params?: TCategoryFilter, options?: CategoryActionOptions) => {
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

    await fetchCategories();
  }, [fetchCategories, isLoading]);

  useEffect(() => {
    void fetchCategories();
  } ,[fetchCategories]);

  const contextValue: CategoryContextProps = useMemo(() => ({
    meta,
    items,
    refresh,
    goToPage,
    fetchList,
    isLoading,
    categories,
    fetchCategories,
  }), [
    meta,
    items,
    refresh,
    goToPage,
    fetchList,
    isLoading,
    categories,
    fetchCategories
  ]);

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryProvider;