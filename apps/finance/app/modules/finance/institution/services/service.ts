import {
  HttpClient ,
  Result ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';
import {
  type TInstitution ,
  type TInstitutionFilter,
} from '@/app/modules/finance/institution';

export class InstitutionService {
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
  public async getInstitutions(filters?: TInstitutionFilter): Promise<Result<TPaginatedListResponse<TInstitution> | Array<TInstitution>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: this.toSnakeCase(filters.name) } : {}),
    }
    return HttpClient.get({
      path: '/institution',
      baseUrl: '/api',
      config: { params }
    })
  }
}