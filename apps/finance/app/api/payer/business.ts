import { DateVO ,type TPaginatedListResponse } from '@machado-repo/shared';
import { TPayerApiResponse } from '@/app/api/payer/types';

import { TPayer } from '@/app/modules/finance/payer';

export function convertPayerApiResponseToPayer(payer: TPayerApiResponse): TPayer {
  return {
    ...payer ,
    created_at: DateVO.format.dateStringToDate(payer.created_at) as Date ,
    updated_at: payer.updated_at ?
      DateVO.format.dateStringToDate(payer.updated_at) :
      undefined ,
  };
}

export function convertInstanceToPayerList(instance: TPaginatedListResponse<TPayerApiResponse> | Array<TPayerApiResponse>): TPaginatedListResponse<TPayer> | Array<TPayer> {
  if (Array.isArray(instance)) {
    return instance.map(convertPayerApiResponseToPayer);
  }
  return {
    ...instance ,
    items: instance.items.map(convertPayerApiResponseToPayer) ,
  };
}