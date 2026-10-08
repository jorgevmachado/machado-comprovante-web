import {
  HttpClient ,
  StringVO ,
  type Result,
  type TPaginatedListResponse ,
} from '@machado-repo/shared';

import {
  mapCategoryJsonListResult,
  mapCategoryJsonResult,
} from '../mappers/category.mapper';
import type {
  CategoryJson,
  TCategory,
  TCategoryFilter,
  TCategoryPersist,
} from '../types';

export class CategoryService {
  public async fetchList(
    filters?: TCategoryFilter,
  ): Promise<Result<TPaginatedListResponse<TCategory> | Array<TCategory>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: StringVO.toSnakeCase(filters.name) } : {}),
    };

    const result = await HttpClient.get<TPaginatedListResponse<CategoryJson> | Array<CategoryJson>>({
      path: '/category',
      baseUrl: '/api',
      config: { params },
    });

    return mapCategoryJsonListResult(result);
  }

  public async create(data: TCategoryPersist): Promise<Result<TCategory>> {
    const result = await HttpClient.post<CategoryJson>({
      path: '/category',
      baseUrl: '/api',
      config: { body: { name: data.name, description: data.description } },
    });

    return mapCategoryJsonResult(result);
  }

  public async update(identifier: string, data: TCategoryPersist): Promise<Result<TCategory>> {
    const result = await HttpClient.put<CategoryJson>({
      path: `/category/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name, description: data.description } },
    });

    return mapCategoryJsonResult(result);
  }
}

export const categoryService = new CategoryService();
