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
  public async getBeneficiaries(params?: TBeneficiaryFilter): Promise<Result<TPaginatedListResponse<TBeneficiary> | Array<TBeneficiary>>> {
    return HttpClient.get({
      path: '/beneficiary',
      baseUrl: '/api',
      config: { params }
    })
  }
}