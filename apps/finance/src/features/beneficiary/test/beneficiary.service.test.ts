import { HttpClient, Result } from '@machado-repo/shared';

import { BeneficiaryService } from '../services/beneficiary.service';

const beneficiary = {
  id: 'beneficiary-1',
  name: 'Acme Corp',
  created_at: '2026-10-08T10:00:00.000Z',
};

describe('BeneficiaryService', () => {
  const service = new BeneficiaryService();
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => jest.resetAllMocks());

  it('fetches beneficiaries with normalized name filters and maps results', async () => {
    get.mockResolvedValueOnce(Result.ok([beneficiary]));

    const result = await service.getBeneficiaries({ name: 'Acme Corp' });

    expect(get).toHaveBeenCalledWith({
      path: '/beneficiary',
      baseUrl: '/api',
      config: { params: { name: 'acme_corp' } },
    });
    expect(Array.isArray(result.instance)).toBe(true);
    if (!Array.isArray(result.instance)) {
      throw new Error('Expected beneficiary response array.');
    }
    expect(result.instance[0]?.created_at).toEqual(new Date(beneficiary.created_at));
  });

  it('creates beneficiaries with only the name', async () => {
    post.mockResolvedValueOnce(Result.ok(beneficiary));

    const result = await service.create({ name: beneficiary.name });

    expect(post).toHaveBeenCalledWith({
      path: '/beneficiary',
      baseUrl: '/api',
      config: { body: { name: beneficiary.name } },
    });
    expect(result.instance.name).toBe(beneficiary.name);
  });

  it('updates beneficiaries by identifier', async () => {
    put.mockResolvedValueOnce(Result.ok(beneficiary));

    await service.update(beneficiary.id, { name: beneficiary.name });

    expect(put).toHaveBeenCalledWith({
      path: `/beneficiary/${beneficiary.id}`,
      baseUrl: '/api',
      config: { body: { name: beneficiary.name } },
    });
  });
});
