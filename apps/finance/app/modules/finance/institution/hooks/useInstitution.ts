import { useCallback ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { TAlertActionOptions ,useAlert ,useLoading } from '@machado-repo/ui';

import {
  TInstitution ,
  TInstitutionFilter,
} from '@/app/modules/finance/institution';
import { institutionService } from '@/app/modules/finance/institution';

type useInstitutionActionOptions = TAlertActionOptions;

export type useInstitutionReturn = {
    meta?: TPaginatedMeta;
    isLoading: boolean;
    institutions: Array<TInstitution>;
    getInstitutions: (params?: TInstitutionFilter, options?: useInstitutionActionOptions) => Promise<void>;
}

const messagePrefix = 'finance.institution';

export default function useInstitution(): useInstitutionReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [institutions, setInstitutions] = useState<Array<TInstitution>>([]);

  const getInstitutions = useCallback(async (params?: TInstitutionFilter, options?: useInstitutionActionOptions) => {
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
        setInstitutions(instance);
        return;
      }

      setMeta(instance.meta);
      setInstitutions(instance.items);
    });
  }, [execute, executeServiceAlert]);

  return { meta, isLoading, institutions, getInstitutions };
}