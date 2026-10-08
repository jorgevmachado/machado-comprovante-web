import { Result } from '@machado-repo/shared';

import {
  mapPayerJsonListResult,
  mapPayerJsonResult,
  payerApiDataToJson,
  payerJsonToDomain,
} from '../mappers/payer.mapper';
import type { PayerApiData, PayerJson } from '../types';

const timestamp = '2026-10-08T10:00:00.000Z';
const payer: PayerApiData & PayerJson = {
  id: 'payer-1',
  name: 'Acme Corp',
  created_at: timestamp,
  updated_at: timestamp,
};

describe('payer mapper', () => {
  it('serializes API dates and hydrates JSON into a domain entity', () => {
    const json = payerApiDataToJson(payer);
    const domain = payerJsonToDomain(json);

    expect(json.created_at).toBe(timestamp);
    expect(json.updated_at).toBe(timestamp);
    expect(domain.created_at).toEqual(new Date(timestamp));
    expect(domain.updated_at).toEqual(new Date(timestamp));
  });

  it('maps JSON lists and returns failures for invalid dates', () => {
    const list = mapPayerJsonListResult(Result.ok([payer]));
    const invalid = mapPayerJsonResult(Result.ok({ ...payer, created_at: 'invalid' }));

    expect(Array.isArray(list.instance)).toBe(true);
    if (!Array.isArray(list.instance)) {
      throw new Error('Expected payer response array.');
    }
    expect(list.instance[0]?.name).toBe(payer.name);
    expect(invalid.isFailure).toBe(true);
    expect(invalid.error).toContain('Invalid payer created_at');
  });
});
