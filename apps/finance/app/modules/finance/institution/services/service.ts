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
  public async getInstitutions(params?: TInstitutionFilter): Promise<Result<TPaginatedListResponse<TInstitution> | Array<TInstitution>>> {
    return HttpClient.get({
      path: '/institution',
      baseUrl: '/api',
      config: { params }
    })
  }
}