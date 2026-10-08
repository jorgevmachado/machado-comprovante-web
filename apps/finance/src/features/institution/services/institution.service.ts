import {
  HttpClient,
  StringVO,
  type Result,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import {
  mapInstitutionJsonListResult ,
  mapInstitutionJsonResult,
} from '../mappers/institution.mapper';
import type {
  InstitutionJson ,
  TInstitution ,
  TInstitutionFilter ,TInstitutionPersist ,
} from '../types';

export class InstitutionService {
  public async getInstitutions(
    filters?: TInstitutionFilter,
  ): Promise<Result<TPaginatedListResponse<TInstitution> | Array<TInstitution>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: StringVO.toSnakeCase(filters.name) } : {}),
    };
    const result = await HttpClient.get<
      TPaginatedListResponse<InstitutionJson> | Array<InstitutionJson>
    >({
      path: '/institution',
      baseUrl: '/api',
      config: { params },
    });

    return mapInstitutionJsonListResult(result);
  }

  public async create(data: TInstitutionPersist): Promise<Result<TInstitution>> {
    const result = await HttpClient.post<InstitutionJson>({
      path: `/institution`,
      baseUrl: '/api',
      config: { body: { name: data.name } },
    })

    return mapInstitutionJsonResult(result);
  }

  public async update(identifier: string, data: TInstitutionPersist): Promise<Result<TInstitution>> {
    const result = await HttpClient.put<InstitutionJson>({
      path: `/institution/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name } },
    })

    return mapInstitutionJsonResult(result);
  }
}

export const institutionService = new InstitutionService();
