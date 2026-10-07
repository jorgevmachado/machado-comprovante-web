import {
  HttpClient ,
  Result ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';
import {
  type TPayer ,
  type TPayerFilter ,TPayerPersist ,
} from '@/app/modules/finance/payer';

export class PayerService {
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

  public async fetchList(filters?: TPayerFilter): Promise<Result<TPaginatedListResponse<TPayer> | Array<TPayer>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: this.toSnakeCase(filters.name) } : {}),
    }
    return HttpClient.get({
      path: '/payer',
      baseUrl: '/api',
      config: { params }
    })
  }

  public async create(data: TPayerPersist): Promise<Result<TPayer>> {
    return HttpClient.post({
      path: '/payer',
      baseUrl: '/api',
      config: { body: { name: data.name } }
    });
  }

  public async update(identifier: string, data: TPayerPersist): Promise<Result<TPayer>> {
    return HttpClient.put({
      path: `/payer/${identifier}`,
      baseUrl: '/api',
      config: { body: { name: data.name } }
    });
  }
}