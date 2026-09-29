import { useCallback ,useState } from 'react';

import type { TPaginatedMeta } from '@machado-repo/shared';

import { TAlertActionOptions ,useAlert ,useLoading } from '@machado-repo/ui';

import {
  TBeneficiary ,
  TBeneficiaryFilter,
} from '@/app/modules/finance/beneficiary';
import { beneficiaryService } from '@/app/modules/finance/beneficiary/services';

type UseBeneficiaryActionOptions = TAlertActionOptions;

export type UseBeneficiaryReturn = {
    meta?: TPaginatedMeta;
    goToPage: (page: number, params?: TBeneficiaryFilter, options?: UseBeneficiaryActionOptions) => Promise<void>;
    isLoading: boolean;
    beneficiaries: Array<TBeneficiary>;
    getBeneficiaries: (params?: TBeneficiaryFilter, options?: UseBeneficiaryActionOptions) => Promise<void>;

}

const messagePrefix = 'finance.beneficiary';

export default function useBeneficiary(): UseBeneficiaryReturn {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [beneficiaries, setBeneficiaries] = useState<Array<TBeneficiary>>([]);

  const getBeneficiaries = useCallback(async (params?: TBeneficiaryFilter, options?: UseBeneficiaryActionOptions) => {
    await execute(async () => {
      const filter: TBeneficiaryFilter = {
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {})
      };
      const response = await beneficiaryService.getBeneficiaries(filter);
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
        setBeneficiaries(instance);
        return;
      }

      setMeta(instance.meta);
      setBeneficiaries(instance.items);
    });
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (page: number, params?: TBeneficiaryFilter, options?: UseBeneficiaryActionOptions) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await getBeneficiaries({ ...params, page: page.toString() }, options);
  }, [clampPage, getBeneficiaries, isLoading, meta?.current_page, meta?.total_pages]);

  return { meta, goToPage, isLoading, beneficiaries, getBeneficiaries };
}