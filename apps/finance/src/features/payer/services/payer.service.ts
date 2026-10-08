import {
  HttpClient,
  StringVO,
  type Result,
  type TPaginatedListResponse,
} from '@machado-repo/shared';

import {
  mapPayerJsonListResult,
  mapPayerJsonResult,
} from '../mappers/payer.mapper';
import type { PayerJson, TPayer, TPayerFilter, TPayerPersist } from '../types';

export class PayerService {
  public async fetchList(
    filters?: TPayerFilter,
  ): Promise<Result<TPaginatedListResponse<TPayer> | Array<TPayer>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: StringVO.toSnakeCase(filters.name) } : {}),
    };
    const result = await HttpClient.get<
      TPaginatedListResponse<PayerJson> | Array<PayerJson>
    >({
      path: '/payer',
      baseUrl: '/api',
      config: { params },
    });

    return mapPayerJsonListResult(result);
  }

  public async create(data: TPayerPersist): Promise<Result<TPayer>> {
    const result = await HttpClient.post<PayerJson>({
      path: '/payer',
      baseUrl: '/api',
      config: { body: { name: data.name } },
    });

    return mapPayerJsonResult(result);
  }

  public async update(identifier: string, data: TPayerPersist): Promise<Result<TPayer>> {
    const result = await HttpClient.put<PayerJson>({
      path: `/payer/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name } },
    });

    return mapPayerJsonResult(result);
  }
}

export const payerService = new PayerService();
