import { act, renderHook } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { payerService } from '../services/payer.service';
import usePayer from '../hooks/usePayer';
import { Payer } from '../domain/Payer';

jest.mock('@machado-repo/ui', () => ({
  useAlert: () => ({ executeServiceAlert: jest.fn() }),
  useLoading: () => ({
    execute: <T,>(callback: () => Promise<T>) => callback(),
    isLoading: false,
  }),
}));

const payer = Payer.create({
  id: 'payer-1',
  name: 'Acme Corp',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
});

describe('usePayer', () => {
  const fetchList = jest.spyOn(payerService, 'fetchList');
  const create = jest.spyOn(payerService, 'create');
  const update = jest.spyOn(payerService, 'update');

  afterEach(() => jest.resetAllMocks());

  it('loads payer items and adds a default page limit', async () => {
    fetchList.mockResolvedValueOnce(Result.ok([payer]));
    const { result } = renderHook(() => usePayer());

    await act(async () => {
      await result.current.fetchList({ page: '2' });
    });

    expect(fetchList).toHaveBeenCalledWith({ page: '2', limit: '10' });
    expect(result.current.items).toEqual([payer]);
  });

  it('refreshes the list after successfully creating a payer', async () => {
    create.mockResolvedValueOnce(Result.ok(payer));
    fetchList.mockResolvedValueOnce(Result.ok([payer]));
    const { result } = renderHook(() => usePayer());

    await act(async () => {
      await expect(result.current.persist({ name: payer.name })).resolves.toEqual(payer);
    });

    expect(create).toHaveBeenCalledWith({ name: payer.name });
    expect(fetchList).toHaveBeenCalledWith({});
    expect(result.current.items).toEqual([payer]);
  });

  it('updates existing payers and refreshes the list', async () => {
    update.mockResolvedValueOnce(Result.ok(payer));
    fetchList.mockResolvedValueOnce(Result.ok([payer]));
    const { result } = renderHook(() => usePayer());

    await act(async () => {
      await result.current.persist({ id: payer.id, name: payer.name });
    });

    expect(update).toHaveBeenCalledWith(payer.id, { id: payer.id, name: payer.name });
    expect(fetchList).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual([payer]);
  });

  it('does not request the current page again', async () => {
    const meta = {
      total: 1,
      limit: 10,
      offset: 0,
      total_pages: 1,
      current_page: 1,
    };
    fetchList.mockResolvedValueOnce(Result.ok({ items: [payer], meta }));
    const { result } = renderHook(() => usePayer());

    await act(async () => {
      await result.current.fetchList();
    });
    fetchList.mockClear();

    await act(async () => {
      await result.current.goToPage(1);
    });

    expect(fetchList).not.toHaveBeenCalled();
    expect(result.current.meta).toEqual(meta);
  });
});
