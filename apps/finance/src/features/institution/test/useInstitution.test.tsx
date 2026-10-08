import { act, renderHook } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { Institution } from '../domain/Institution';
import { institutionService } from '../services/institution.service';
import useInstitution from '../hooks/useInstitution';

jest.mock('@machado-repo/ui', () => {
  const executeLoading = <T,>(callback: () => Promise<T>) => callback();
  const executeServiceAlert = jest.fn();

  return {
    useAlert: () => ({ executeServiceAlert }),
    useLoading: () => ({ execute: executeLoading, isLoading: false }),
  };
});

const institution = Institution.create({
  id: 'institution-1',
  name: 'Example Bank',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
});

describe('useInstitution', () => {
  const getInstitutions = jest.spyOn(institutionService, 'getInstitutions');
  const create = jest.spyOn(institutionService, 'create');
  const update = jest.spyOn(institutionService, 'update');

  afterEach(() => jest.resetAllMocks());

  it('loads arrays and paginated results', async () => {
    getInstitutions
      .mockResolvedValueOnce(Result.ok([institution]))
      .mockResolvedValueOnce(Result.ok({
        items: [institution],
        meta: {
          total: 1,
          limit: 10,
          offset: 0,
          total_pages: 1,
          current_page: 1,
        },
      }));
    const { result } = renderHook(() => useInstitution());

    await act(async () => {
      await result.current.fetchList({ name: 'Example' });
      await result.current.fetchList({ page: '1' });
    });

    expect(getInstitutions).toHaveBeenNthCalledWith(1, { name: 'Example' });
    expect(getInstitutions).toHaveBeenNthCalledWith(2, { page: '1' });
    expect(result.current.meta?.current_page).toBe(1);
    expect(result.current.items).toEqual([institution]);
  });

  it('creates and updates institutions, refreshing after successful persistence', async () => {
    create.mockResolvedValueOnce(Result.ok(institution));
    update.mockResolvedValueOnce(Result.ok(institution));
    getInstitutions
      .mockResolvedValueOnce(Result.ok([institution]))
      .mockResolvedValueOnce(Result.ok([institution]));
    const { result } = renderHook(() => useInstitution());

    await act(async () => {
      await result.current.persist({ name: institution.name });
      await result.current.persist({ id: institution.id, name: institution.name });
    });

    expect(create).toHaveBeenCalledWith({ name: institution.name });
    expect(update).toHaveBeenCalledWith(institution.id, {
      id: institution.id,
      name: institution.name,
    });
    expect(getInstitutions).toHaveBeenCalledTimes(2);
  });

  it('reports updates without identifiers and does not refresh failed mutations', async () => {
    create.mockResolvedValueOnce(Result.fail('Create failed'));
    update.mockResolvedValueOnce(Result.fail('Update failed'));
    const { result } = renderHook(() => useInstitution());

    await act(async () => {
      await result.current.persist({ name: institution.name });
    });
    expect(update).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.persist({ id: institution.id, name: institution.name });
    });
    expect(update).toHaveBeenCalledTimes(1);
    expect(getInstitutions).not.toHaveBeenCalled();
  });

  it('clamps pagination and refreshes the list', async () => {
    getInstitutions
      .mockResolvedValueOnce(Result.ok({
        items: [institution],
        meta: {
          total: 2,
          limit: 1,
          offset: 0,
          total_pages: 2,
          current_page: 1,
        },
      }))
      .mockResolvedValueOnce(Result.ok([institution]))
      .mockResolvedValueOnce(Result.ok([institution]));
    const { result } = renderHook(() => useInstitution());

    await act(async () => {
      await result.current.fetchList();
    });
    await act(async () => {
      await result.current.goToPage(1);
    });
    expect(getInstitutions).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.goToPage(9);
      await result.current.refresh();
    });
    expect(getInstitutions).toHaveBeenNthCalledWith(2, { page: '2' });
    expect(getInstitutions).toHaveBeenNthCalledWith(3, undefined);
  });
});
