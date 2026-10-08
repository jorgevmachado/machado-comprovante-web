import { act, renderHook } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { beneficiaryService } from '../services/beneficiary.service';
import { Beneficiary } from '../domain/Beneficiary';
import useBeneficiary from '../hooks/useBeneficiary';

jest.mock('@machado-repo/ui', () => {
  const executeLoading = <T,>(callback: () => Promise<T>) => callback();
  const executeServiceAlert = jest.fn();

  return {
    useAlert: () => ({ executeServiceAlert }),
    useLoading: () => ({ execute: executeLoading, isLoading: false }),
  };
});

const beneficiary = Beneficiary.create({
  id: 'beneficiary-1',
  name: 'Example',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
});

describe('useBeneficiary', () => {
  const getBeneficiaries = jest.spyOn(beneficiaryService, 'getBeneficiaries');
  const create = jest.spyOn(beneficiaryService, 'create');
  const update = jest.spyOn(beneficiaryService, 'update');

  afterEach(() => jest.resetAllMocks());

  it('fetches arrays with a default limit when a page is provided', async () => {
    getBeneficiaries.mockResolvedValueOnce(Result.ok([beneficiary]));
    const { result } = renderHook(() => useBeneficiary());

    await act(async () => {
      await result.current.fetchList({ page: '2' });
    });

    expect(getBeneficiaries).toHaveBeenCalledWith({ page: '2', limit: '10' });
    expect(result.current.items).toEqual([beneficiary]);
  });

  it('stores paginated metadata and ignores empty responses', async () => {
    const meta = {
      total: 1,
      limit: 10,
      offset: 0,
      total_pages: 1,
      current_page: 1,
    };
    getBeneficiaries
      .mockResolvedValueOnce(Result.ok({ items: [beneficiary], meta }))
      .mockResolvedValueOnce(Result.empty());
    const { result } = renderHook(() => useBeneficiary());

    await act(async () => {
      await result.current.fetchList();
    });
    expect(result.current.meta).toEqual(meta);
    await act(async () => {
      await result.current.fetchList();
    });
    expect(result.current.items).toEqual([beneficiary]);
  });

  it('creates and updates beneficiaries, refreshing after success', async () => {
    create.mockResolvedValueOnce(Result.ok(beneficiary));
    update.mockResolvedValueOnce(Result.ok(beneficiary));
    getBeneficiaries
      .mockResolvedValueOnce(Result.ok([beneficiary]))
      .mockResolvedValueOnce(Result.ok([beneficiary]));
    const { result } = renderHook(() => useBeneficiary());

    await act(async () => {
      await expect(result.current.persist({ name: beneficiary.name })).resolves.toEqual(beneficiary);
      await expect(result.current.persist({ id: beneficiary.id, name: beneficiary.name }))
        .resolves.toEqual(beneficiary);
    });

    expect(create).toHaveBeenCalledWith({ name: beneficiary.name });
    expect(update).toHaveBeenCalledWith(beneficiary.id, {
      id: beneficiary.id,
      name: beneficiary.name,
    });
    expect(getBeneficiaries).toHaveBeenCalledTimes(2);
  });

  it('reports a missing update identifier and does not refresh failures', async () => {
    create.mockResolvedValueOnce(Result.fail('Create failed'));
    update.mockResolvedValueOnce(Result.fail('Update failed'));
    const { result } = renderHook(() => useBeneficiary());

    await act(async () => {
      await expect(result.current.persist({ name: beneficiary.name })).resolves.toBeUndefined();
    });
    expect(update).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.persist({ id: beneficiary.id, name: beneficiary.name });
    });
    expect(update).toHaveBeenCalledTimes(1);
    expect(getBeneficiaries).not.toHaveBeenCalled();
  });

  it('clamps page navigation and refreshes the list', async () => {
    getBeneficiaries
      .mockResolvedValueOnce(Result.ok({
        items: [beneficiary],
        meta: {
          total: 2,
          limit: 1,
          offset: 0,
          total_pages: 2,
          current_page: 1,
        },
      }))
      .mockResolvedValueOnce(Result.ok([beneficiary]))
      .mockResolvedValueOnce(Result.ok([beneficiary]));
    const { result } = renderHook(() => useBeneficiary());

    await act(async () => {
      await result.current.fetchList();
    });
    await act(async () => {
      await result.current.goToPage(1);
    });
    expect(getBeneficiaries).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.goToPage(9);
      await result.current.refresh();
    });
    expect(getBeneficiaries).toHaveBeenNthCalledWith(2, { page: '9', limit: '10' });
    expect(getBeneficiaries).toHaveBeenNthCalledWith(3, {});
  });
});
