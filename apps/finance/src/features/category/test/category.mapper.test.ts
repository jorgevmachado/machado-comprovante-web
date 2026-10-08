import { Result } from '@machado-repo/shared';

import {
  categoryApiDataToJson,
  categoryJsonToDomain,
  mapCategoryJsonListResult,
  mapCategoryJsonResult,
} from '../mappers/category.mapper';
import type { CategoryApiData, CategoryJson } from '../types';

const timestamp = '2026-10-08T10:00:00.000Z';
const category: CategoryApiData & CategoryJson = {
  id: 'category-1',
  name: 'Utilities',
  description: 'Monthly bills',
  created_at: timestamp,
  updated_at: timestamp,
};

describe('category mapper', () => {
  it('serializes category dates and hydrates JSON into a domain entity', () => {
    const json = categoryApiDataToJson(category);
    const domain = categoryJsonToDomain(json);

    expect(json).toMatchObject({
      name: category.name,
      description: category.description,
      created_at: timestamp,
      updated_at: timestamp,
    });
    expect(domain.created_at).toEqual(new Date(timestamp));
    expect(domain.updated_at).toEqual(new Date(timestamp));
  });

  it('maps JSON lists and returns failures for invalid dates', () => {
    const list = mapCategoryJsonListResult(Result.ok([category]));
    const invalid = mapCategoryJsonResult(
      Result.ok({ ...category, created_at: 'invalid' }),
    );

    expect(Array.isArray(list.instance)).toBe(true);
    if (!Array.isArray(list.instance)) {
      throw new Error('Expected category response array.');
    }
    expect(list.instance[0]?.name).toBe(category.name);
    expect(invalid.isFailure).toBe(true);
    expect(invalid.error).toContain('Invalid category created_at');
  });
});
