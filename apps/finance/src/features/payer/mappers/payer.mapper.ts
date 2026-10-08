import type { Result as TResult, TPaginatedListResponse } from '@machado-repo/shared';

import { Payer } from '../domain/Payer';
import type { PayerApiData, PayerJson } from '../types';
import { mapListResult, mapResult, parseDate } from '@/src/shared/result.mapper';

export function payerApiDataToDomain(data: PayerApiData): Payer {
  return Payer.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'payer'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'payer'),
  });
}

export function payerJsonToDomain(data: PayerJson): Payer {
  return payerApiDataToDomain(data);
}

export function payerDomainToJson(payer: Payer): PayerJson {
  return {
    id: payer.id,
    name: payer.name,
    created_at: payer.created_at.toISOString(),
    ...(payer.updated_at
      ? { updated_at: payer.updated_at.toISOString() }
      : {}),
  };
}

export function payerApiDataToJson(data: PayerApiData): PayerJson {
  return payerDomainToJson(payerApiDataToDomain(data));
}

export function mapPayerJsonResult(
  result: TResult<PayerJson>,
): TResult<Payer> {
  return mapResult(result, payerJsonToDomain);
}

export function mapPayerJsonListResult(
  result: TResult<TPaginatedListResponse<PayerJson> | Array<PayerJson>>,
): TResult<TPaginatedListResponse<Payer> | Array<Payer>> {
  return mapListResult(result, payerJsonToDomain);
}
