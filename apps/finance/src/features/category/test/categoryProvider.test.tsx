import { act, renderHook, waitFor } from '@testing-library/react';
import { Result } from '@machado-repo/shared';

import { Category } from '../domain/Category';
import { categoryService } from '../services';
import CategoryProvider from '../hooks/categoryProvider';
import { useCategory } from '../hooks';

jest.mock('@machado-repo/ui', () => {
  const executeLoading = <T,>(callback: () => Promise<T>) => callback();
  const executeServiceAlert = jest.fn();

  return {
    useAlert: () => ({ executeServiceAlert }),
    useLoading: () => ({ execute: executeLoading, isLoading: false }),
  };
});

const category = Category.create({
  id: 'category-1',
  name: 'Utilities',
  created_at: new Date('2026-10-08T10:00:00.000Z'),
});

describe('CategoryProvider', () => {
  const fetchList = jest.spyOn(categoryService, 'fetchList');
  const create = jest.spyOn(categoryService, 'create');
  const update = jest.spyOn(categoryService, 'update');

  afterEach(() => jest.resetAllMocks());

  it('fetches categories on mount and stores category arrays', async () => {
    fetchList.mockResolvedValueOnce(Result.ok([category]));
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    await waitFor(() => expect(result.current.categories).toEqual([category]));
    expect(fetchList).toHaveBeenCalledWith({});
  });

  it('loads paginated items and navigates using the clamped page', async () => {
    fetchList
      .mockResolvedValueOnce(Result.ok([category]))
      .mockResolvedValueOnce(Result.ok({
        items: [category],
        meta: {
          total: 3,
          limit: 1,
          offset: 0,
          total_pages: 3,
          current_page: 1,
        },
      }))
      .mockResolvedValueOnce(Result.ok([category]));
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    await waitFor(() => expect(result.current.categories).toEqual([category]));
    await act(async () => {
      await result.current.fetchList({ page: '1' });
    });
    expect(result.current.meta?.current_page).toBe(1);
    expect(fetchList).toHaveBeenNthCalledWith(2, { page: '1', limit: '10' });

    await act(async () => {
      await result.current.goToPage(1);
    });
    expect(fetchList).toHaveBeenCalledTimes(2);

    await act(async () => {
      await result.current.goToPage(8);
    });
    expect(fetchList).toHaveBeenNthCalledWith(3, { page: '8', limit: '10' });
  });

  it('filters categories by name and handles empty results', async () => {
    fetchList
      .mockResolvedValueOnce(Result.empty())
      .mockResolvedValueOnce(Result.ok([category]))
      .mockResolvedValueOnce(Result.empty());
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    await waitFor(() => expect(fetchList).toHaveBeenCalledTimes(1));
    await act(async () => {
      await result.current.fetchCategories('utilities');
    });
    expect(fetchList).toHaveBeenNthCalledWith(2, { name: 'utilities' });
    expect(result.current.categories).toEqual([category]);

    await act(async () => {
      await result.current.fetchCategories('');
    });
    expect(fetchList).toHaveBeenNthCalledWith(3, {});
  });

  it('creates and updates categories and refreshes both views on success', async () => {
    fetchList
      .mockResolvedValueOnce(Result.ok([]))
      .mockResolvedValueOnce(Result.ok([category]))
      .mockResolvedValueOnce(Result.ok([category]))
      .mockResolvedValueOnce(Result.ok([category]))
      .mockResolvedValueOnce(Result.ok([category]));
    create.mockResolvedValueOnce(Result.ok(category));
    update.mockResolvedValueOnce(Result.ok(category));
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    await waitFor(() => expect(fetchList).toHaveBeenCalledTimes(1));
    await act(async () => {
      await result.current.persist({ name: category.name });
      await result.current.persist({ id: category.id, name: category.name });
    });

    expect(create).toHaveBeenCalledWith({ name: category.name });
    expect(update).toHaveBeenCalledWith(category.id, {
      id: category.id,
      name: category.name,
    });
    expect(fetchList).toHaveBeenCalledTimes(5);
  });

  it('creates for items without identifiers and does not refresh failed mutations', async () => {
    fetchList.mockResolvedValueOnce(Result.ok([]));
    create.mockResolvedValueOnce(Result.fail('Create failed'));
    update.mockResolvedValueOnce(Result.fail('Update failed'));
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    await waitFor(() => expect(fetchList).toHaveBeenCalledTimes(1));
    await act(async () => {
      await result.current.persist({ name: category.name });
      await result.current.persist({ id: category.id, name: category.name });
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    expect(fetchList).toHaveBeenCalledTimes(1);
  });
});
