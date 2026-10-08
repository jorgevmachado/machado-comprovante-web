import type { Result as TResult, TPaginatedListResponse } from '@machado-repo/shared';

import { Category } from '../domain/Category';
import type {
  CategoryApiData,
  CategoryJson,
} from '../types';
import { mapListResult, mapResult, parseDate } from '@/src/shared/result.mapper';

export function categoryApiDataToDomain(data: CategoryApiData): Category {
  return Category.create({
    id: data.id,
    name: data.name,
    description: data.description,
    created_at: parseDate(data.created_at, 'created_at', 'category'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'category'),
  });
}

export function categoryJsonToDomain(data: CategoryJson): Category {
  return categoryApiDataToDomain(data);
}

export function categoryDomainToJson(category: Category): CategoryJson {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    created_at: category.created_at.toISOString(),
    ...(category.updated_at
      ? { updated_at: category.updated_at.toISOString() }
      : {}),
  };
}

export function categoryApiDataToJson(data: CategoryApiData): CategoryJson {
  return categoryDomainToJson(categoryApiDataToDomain(data));
}

export function mapCategoryJsonResult(
  result: TResult<CategoryJson>,
): TResult<Category> {
  return mapResult(result, categoryJsonToDomain);
}

export function mapCategoryJsonListResult(
  result: TResult<TPaginatedListResponse<CategoryJson> | Array<CategoryJson>>,
): TResult<TPaginatedListResponse<Category> | Array<Category>> {
  return mapListResult(result, categoryJsonToDomain);
}
