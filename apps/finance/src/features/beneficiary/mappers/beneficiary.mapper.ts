import type { Result as TResult, TPaginatedListResponse } from '@machado-repo/shared';

import { Beneficiary } from '../domain/Beneficiary';
import type { BeneficiaryApiData, BeneficiaryJson } from '../types';
import { mapListResult, mapResult, parseDate } from '@/src/shared/result.mapper';

export function beneficiaryApiDataToDomain(data: BeneficiaryApiData): Beneficiary {
  return Beneficiary.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'beneficiary'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'beneficiary'),
  });
}

export function beneficiaryJsonToDomain(data: BeneficiaryJson): Beneficiary {
  return beneficiaryApiDataToDomain(data);
}

export function beneficiaryDomainToJson(beneficiary: Beneficiary): BeneficiaryJson {
  return {
    id: beneficiary.id,
    name: beneficiary.name,
    created_at: beneficiary.created_at.toISOString(),
    ...(beneficiary.updated_at
      ? { updated_at: beneficiary.updated_at.toISOString() }
      : {}),
  };
}

export function beneficiaryApiDataToJson(data: BeneficiaryApiData): BeneficiaryJson {
  return beneficiaryDomainToJson(beneficiaryApiDataToDomain(data));
}

export function mapBeneficiaryJsonListResult(
  result: TResult<TPaginatedListResponse<BeneficiaryJson> | Array<BeneficiaryJson>>,
): TResult<TPaginatedListResponse<Beneficiary> | Array<Beneficiary>> {
  return mapListResult(result, beneficiaryJsonToDomain);
}

export function mapBeneficiaryJsonResult(
  result: TResult<BeneficiaryJson>,
): TResult<Beneficiary> {
  return mapResult(result, beneficiaryJsonToDomain);
}
