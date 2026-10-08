import { HttpClient, Result } from '@machado-repo/shared';

import { InstitutionService } from '../services/institution.service';

const institution = {
  id: 'institution-1',
  name: 'Acme Bank',
  created_at: '2026-10-08T10:00:00.000Z',
};

describe('InstitutionService', () => {
  const service = new InstitutionService();
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => jest.resetAllMocks());

  it('fetches institutions with normalized name filters and maps results', async () => {
    get.mockResolvedValueOnce(Result.ok([institution]));

    const result = await service.getInstitutions({ name: 'Acme Bank' });

    expect(get).toHaveBeenCalledWith({
      path: '/institution',
      baseUrl: '/api',
      config: { params: { name: 'acme_bank' } },
    });
    expect(Array.isArray(result.instance)).toBe(true);
    if (!Array.isArray(result.instance)) {
      throw new Error('Expected institution response array.');
    }
    expect(result.instance[0]?.created_at).toEqual(new Date(institution.created_at));
  });

  it('creates institutions with only the name', async () => {
    post.mockResolvedValueOnce(Result.ok(institution));

    const result = await service.create({ name: institution.name });

    expect(post).toHaveBeenCalledWith({
      path: '/institution',
      baseUrl: '/api',
      config: { body: { name: institution.name } },
    });
    expect(result.instance.name).toBe(institution.name);
  });

  it('updates institutions by identifier', async () => {
    put.mockResolvedValueOnce(Result.ok(institution));

    await service.update(institution.id, { name: institution.name });

    expect(put).toHaveBeenCalledWith({
      path: `/institution/${institution.id}`,
      baseUrl: '/api',
      config: { body: { name: institution.name } },
    });
  });
});
