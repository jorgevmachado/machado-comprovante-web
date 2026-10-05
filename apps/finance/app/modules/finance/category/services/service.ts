import {
  HttpClient ,
  Result ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';
import {
  type TCategory ,
  type TCategoryFilter ,TCategoryPersist ,
} from '@/app/modules/finance/category';

export class CategoryService {
  private toSnakeCase(value?: string): string {
    if (!value) {
      return '';
    }
    const matches = value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g);

    if (!matches) {
      return value;
    }

    return matches.map((word) => word.toLowerCase()).join('_');
  }

  public async fetchList(filters?: TCategoryFilter): Promise<Result<TPaginatedListResponse<TCategory> | Array<TCategory>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: this.toSnakeCase(filters.name) } : {}),
    }
    return HttpClient.get({
      path: '/category',
      baseUrl: '/api',
      config: { params }
    })
  }

  public async create(data: TCategoryPersist): Promise<Result<TCategory>> {
    return HttpClient.post({
      path: '/category',
      baseUrl: '/api',
      config: { body: { name: data.name, description: data.description } }
    });
  }

  public async update(identifier: string, data: TCategoryPersist): Promise<Result<TCategory>> {
    return HttpClient.put({
      path: `/category/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name, description: data.description } }
    });
  }
}