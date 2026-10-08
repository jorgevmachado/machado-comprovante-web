import type { Result as TResult, TPaginatedListResponse } from '@machado-repo/shared';

import { Institution } from '../domain/Institution';
import type { InstitutionApiData, InstitutionJson } from '../types';
import { mapListResult, mapResult, parseDate } from '@/src/shared/result.mapper';

export function institutionApiDataToDomain(data: InstitutionApiData): Institution {
  return Institution.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'institution'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'institution'),
  });
}

export function institutionJsonToDomain(data: InstitutionJson): Institution {
  return institutionApiDataToDomain(data);
}

export function institutionDomainToJson(institution: Institution): InstitutionJson {
  return {
    id: institution.id,
    name: institution.name,
    created_at: institution.created_at.toISOString(),
    ...(institution.updated_at
      ? { updated_at: institution.updated_at.toISOString() }
      : {}),
  };
}

export function institutionApiDataToJson(data: InstitutionApiData): InstitutionJson {
  return institutionDomainToJson(institutionApiDataToDomain(data));
}

export function mapInstitutionJsonListResult(
  result: TResult<TPaginatedListResponse<InstitutionJson> | Array<InstitutionJson>>,
): TResult<TPaginatedListResponse<Institution> | Array<Institution>> {
  return mapListResult(result, institutionJsonToDomain);
}

export function mapInstitutionJsonResult(
  result: TResult<InstitutionJson>,
): TResult<Institution> {
  return mapResult(result, institutionJsonToDomain);
}
