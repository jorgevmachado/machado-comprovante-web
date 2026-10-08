import { HttpClient, Result } from '@machado-repo/shared';

import { CategoryService } from '../services/category.service';

const category = {
  id: 'category-1',
  name: 'Utilities',
  description: 'Monthly bills',
  created_at: '2026-10-08T10:00:00.000Z',
};

describe('CategoryService', () => {
  const service = new CategoryService();
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  afterEach(() => jest.resetAllMocks());

  it('fetches categories with normalized name filters and maps results', async () => {
    get.mockResolvedValueOnce(Result.ok([category]));

    const result = await service.fetchList({ name: 'Monthly Bills' });

    expect(get).toHaveBeenCalledWith({
      path: '/category',
      baseUrl: '/api',
      config: { params: { name: 'monthly_bills' } },
    });
    expect(Array.isArray(result.instance)).toBe(true);
    if (!Array.isArray(result.instance)) {
      throw new Error('Expected category response array.');
    }
    expect(result.instance[0]).toMatchObject({
      name: category.name,
      description: category.description,
      created_at: new Date(category.created_at),
    });
  });

  it('creates categories with their name and description', async () => {
    post.mockResolvedValueOnce(Result.ok(category));

    const result = await service.create(category);

    expect(post).toHaveBeenCalledWith({
      path: '/category',
      baseUrl: '/api',
      config: { body: { name: category.name, description: category.description } },
    });
    expect(result.instance.name).toBe(category.name);
  });

  it('updates categories by identifier', async () => {
    put.mockResolvedValueOnce(Result.ok(category));

    await service.update(category.id, category);

    expect(put).toHaveBeenCalledWith({
      path: `/category/${category.id}`,
      baseUrl: '/api',
      config: { body: { name: category.name, description: category.description } },
    });
  });
});
