import { Result } from '@machado-repo/shared';

import {
  institutionApiDataToJson,
  institutionJsonToDomain,
  mapInstitutionJsonListResult,
  mapInstitutionJsonResult,
} from '../mappers/institution.mapper';
import type { InstitutionApiData, InstitutionJson } from '../types';

const timestamp = '2026-10-08T10:00:00.000Z';
const institution: InstitutionApiData & InstitutionJson = {
  id: 'institution-1',
  name: 'Acme Bank',
  created_at: timestamp,
  updated_at: timestamp,
};

describe('institution mapper', () => {
  it('serializes API dates and hydrates JSON into a domain entity', () => {
    const json = institutionApiDataToJson(institution);
    const domain = institutionJsonToDomain(json);

    expect(json.created_at).toBe(timestamp);
    expect(json.updated_at).toBe(timestamp);
    expect(domain.created_at).toEqual(new Date(timestamp));
    expect(domain.updated_at).toEqual(new Date(timestamp));
  });

  it('maps JSON lists and returns failures for invalid dates', () => {
    const list = mapInstitutionJsonListResult(Result.ok([institution]));
    const invalid = mapInstitutionJsonResult(
      Result.ok({ ...institution, created_at: 'invalid' }),
    );

    expect(Array.isArray(list.instance)).toBe(true);
    if (!Array.isArray(list.instance)) {
      throw new Error('Expected institution response array.');
    }
    expect(list.instance[0]?.name).toBe(institution.name);
    expect(invalid.isFailure).toBe(true);
    expect(invalid.error).toContain('Invalid institution created_at');
  });
});
