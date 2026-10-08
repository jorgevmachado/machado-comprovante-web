import { HttpClient, Result } from '@machado-repo/shared';

import { PayerService } from '../services/payer.service';

const payer = {
  id: 'payer-1',
  name: 'Acme Corp',
  created_at: '2026-10-08T10:00:00.000Z',
};

describe('PayerService', () => {
  const service = new PayerService();
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches and maps a list using normalized filter names', async () => {
    get.mockResolvedValueOnce(Result.ok([payer]));

    const result = await service.fetchList({ name: 'Acme Corp' });

    expect(get).toHaveBeenCalledWith({
      path: '/payer',
      baseUrl: '/api',
      config: { params: { name: 'acme_corp' } },
    });
    expect(result.isOk).toBe(true);
    expect(result.instance).toEqual([
      expect.objectContaining({
        id: payer.id,
        name: payer.name,
        created_at: new Date(payer.created_at),
      }),
    ]);
  });

  it('creates a payer and sends only its name', async () => {
    post.mockResolvedValueOnce(Result.ok(payer));

    const result = await service.create({ name: payer.name });

    expect(post).toHaveBeenCalledWith({
      path: '/payer',
      baseUrl: '/api',
      config: { body: { name: payer.name } },
    });
    expect(result.isOk).toBe(true);
    expect(result.instance.name).toBe(payer.name);
  });

  it('updates a payer by identifier', async () => {
    put.mockResolvedValueOnce(Result.ok(payer));

    const result = await service.update(payer.id, { name: payer.name });

    expect(put).toHaveBeenCalledWith({
      path: `/payer/${payer.id}`,
      baseUrl: '/api',
      config: { body: { name: payer.name } },
    });
    expect(result.isOk).toBe(true);
  });
});
