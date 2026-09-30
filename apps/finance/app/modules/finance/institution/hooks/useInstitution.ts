import { useCallback ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { TAlertActionOptions ,useAlert ,useLoading } from '@machado-repo/ui';

import {
  TInstitution ,
  TInstitutionFilter,
} from '@/app/modules/finance/institution';
import { institutionService } from '@/app/modules/finance/institution';
import type { TPaymentFilter } from '@/app/modules/finance';

type useInstitutionActionOptions = TAlertActionOptions;

export type useInstitutionReturn = {
    meta?: TPaginatedMeta;
    items: Array<TInstitution>;
    goToPage: (page: number, params?: TInstitutionFilter, options?: useInstitutionActionOptions) => Promise<void>;
    isLoading: boolean;
    fetchList: (params?: TInstitutionFilter, options?: useInstitutionActionOptions) => Promise<void>;
}

const messagePrefix = 'finance.institution';

export default function useInstitution(): useInstitutionReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<TInstitution>>([]);

  const fetchList = useCallback(async (params?: TInstitutionFilter, options?: useInstitutionActionOptions) => {
    await execute(async () => {
      const response = await institutionService.getInstitutions(params);
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

  const goToPage = useCallback(async (page: number, params?: TPaymentFilter, options?: useInstitutionActionOptions) => {
    const targetPage = Math.min(Math.max(page, 1), Math.max(meta?.total_pages ?? 1, 1));

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    const nextParams = {
      ...params,
      page: targetPage.toString(),
    };

    await fetchList(nextParams, options);
  }, [fetchList, isLoading, meta]);

  return { meta, goToPage, isLoading, items, fetchList };
}