import { Result } from '@machado-repo/shared';

import {
  beneficiaryApiDataToJson,
  beneficiaryJsonToDomain,
  mapBeneficiaryJsonListResult,
  mapBeneficiaryJsonResult,
} from '../mappers/beneficiary.mapper';
import type { BeneficiaryApiData, BeneficiaryJson } from '../types';

const timestamp = '2026-10-08T10:00:00.000Z';
const beneficiary: BeneficiaryApiData & BeneficiaryJson = {
  id: 'beneficiary-1',
  name: 'Acme Corp',
  created_at: timestamp,
  updated_at: timestamp,
};

describe('beneficiary mapper', () => {
  it('serializes API dates and hydrates JSON into a domain entity', () => {
    const json = beneficiaryApiDataToJson(beneficiary);
    const domain = beneficiaryJsonToDomain(json);

    expect(json.created_at).toBe(timestamp);
    expect(json.updated_at).toBe(timestamp);
    expect(domain.created_at).toEqual(new Date(timestamp));
    expect(domain.updated_at).toEqual(new Date(timestamp));
  });

  it('maps JSON lists and returns failures for invalid dates', () => {
    const list = mapBeneficiaryJsonListResult(Result.ok([beneficiary]));
    const invalid = mapBeneficiaryJsonResult(
      Result.ok({ ...beneficiary, created_at: 'invalid' }),
    );

    expect(Array.isArray(list.instance)).toBe(true);
    if (!Array.isArray(list.instance)) {
      throw new Error('Expected beneficiary response array.');
    }
    expect(list.instance[0]?.name).toBe(beneficiary.name);
    expect(invalid.isFailure).toBe(true);
    expect(invalid.error).toContain('Invalid beneficiary created_at');
  });
});
