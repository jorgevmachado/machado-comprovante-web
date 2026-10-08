import {
  HttpClient,
  StringVO,
  type Result,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import {
  mapBeneficiaryJsonListResult ,
  mapBeneficiaryJsonResult,
} from '../mappers/beneficiary.mapper';
import type {
  BeneficiaryJson ,
  TBeneficiary ,
  TBeneficiaryFilter ,TBeneficiaryPersist ,
} from '../types';

export class BeneficiaryService {
  public async getBeneficiaries(
    filters?: TBeneficiaryFilter,
  ): Promise<Result<TPaginatedListResponse<TBeneficiary> | Array<TBeneficiary>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: StringVO.toSnakeCase(filters.name) } : {}),
    };

    const result = await HttpClient.get<
      TPaginatedListResponse<BeneficiaryJson> | Array<BeneficiaryJson>
    >({
      path: '/beneficiary',
      baseUrl: '/api',
      config: { params },
    });

    return mapBeneficiaryJsonListResult(result);
  }

  public async create(data: TBeneficiaryPersist): Promise<Result<TBeneficiary>> {
    const result = await HttpClient.post<BeneficiaryJson>({
      path: `/beneficiary`,
      baseUrl: '/api',
      config: { body: { name: data.name } },
    });

    return mapBeneficiaryJsonResult(result);
  }

  public async update(identifier: string, data: TBeneficiaryPersist): Promise<Result<TBeneficiary>> {
    const result = await HttpClient.put<BeneficiaryJson>({
      path: `/beneficiary/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name } },
    });

    return mapBeneficiaryJsonResult(result);
  }
}

export const beneficiaryService = new BeneficiaryService();
