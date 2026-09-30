import {
  HttpClient ,
  Result ,
  type TPaginatedListResponse,
} from '@machado-repo/shared';
import {
  type TBeneficiary ,
  type TBeneficiaryFilter,
} from '@/app/modules/finance/beneficiary';

export class BeneficiaryService {
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
  public async getBeneficiaries(filters?: TBeneficiaryFilter): Promise<Result<TPaginatedListResponse<TBeneficiary> | Array<TBeneficiary>>> {
    const params = {
      ...filters,
      ...(filters?.name ? { name: this.toSnakeCase(filters.name) } : {}),
    }
    return HttpClient.get({
      path: '/beneficiary',
      baseUrl: '/api',
      config: { params }
    })
  }
}