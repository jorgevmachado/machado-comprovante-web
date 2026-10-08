import { fireEvent, render, screen } from '@testing-library/react';
import {
  Pagination,
  Table,
  useModal,
} from '@machado-repo/ui';

import CategoryListPage from '../category/pages/list/CategoryList';
import PayerPage from '../payer/pages/PayerPage';
import BeneficiaryPage from '../beneficiary/pages/BeneficiaryPage';
import InstitutionList from '../institution/components/list/InstitutionList';
import { useCategory } from '../category/hooks';
import { usePayer } from '../payer/hooks';
import { useBeneficiary } from '../beneficiary/hooks';
import { useInstitution } from '../institution/hooks';

jest.mock('@machado-repo/ui', () => ({
  Button: jest.fn(({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  )),
  Filters: jest.fn(({ onApply }: { onApply: (filters: Record<string, string>) => void }) => (
    <button onClick={() => onApply({ name: 'filtered' })}>Apply filter</button>
  )),
  Pagination: jest.fn(({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button onClick={() => onPageChange(2)}>Next page</button>
  )),
  Table: jest.fn(() => null),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useModal: jest.fn(),
}));

jest.mock('../category/hooks', () => ({ useCategory: jest.fn() }));
jest.mock('../payer/hooks', () => ({ usePayer: jest.fn() }));
jest.mock('../beneficiary/hooks', () => ({ useBeneficiary: jest.fn() }));
jest.mock('../institution/hooks', () => ({ useInstitution: jest.fn() }));

const category = { id: 'category-1', name: 'Utilities', description: 'Bills' };
const payer = { id: 'payer-1', name: 'Avery' };
const beneficiary = { id: 'beneficiary-1', name: 'Power Co.' };
const institution = { id: 'institution-1', name: 'Bank A' };
const meta = {
  total: 2,
  limit: 1,
  offset: 0,
  total_pages: 2,
  current_page: 1,
};

const openModal = jest.fn();
const closeModal = jest.fn();
const fetchList = jest.fn();
const goToPage = jest.fn();
const persist = jest.fn();

function hookValue(items: Array<unknown>, isLoading = false, withMeta = false) {
  return {
    items,
    meta: withMeta ? meta : undefined,
    isLoading,
    fetchList,
    goToPage,
    persist,
  };
}

describe('finance list pages', () => {
  beforeEach(() => {
    jest.mocked(useModal).mockReturnValue({
      modal: null,
      openModal,
      closeModal,
    } as never);
    jest.mocked(useCategory).mockReturnValue(hookValue([], true) as never);
    jest.mocked(usePayer).mockReturnValue(hookValue([]) as never);
    jest.mocked(useBeneficiary).mockReturnValue(hookValue([beneficiary], false, true) as never);
    jest.mocked(useInstitution).mockReturnValue(hookValue([institution], false, true) as never);
  });

  afterEach(() => jest.clearAllMocks());

  it('loads categories, supports filtering, creation and edit persistence', async () => {
    const { rerender } = render(<CategoryListPage />);
    expect(fetchList).toHaveBeenCalledWith({ page: '1' });
    expect(screen.getByText('common.loading')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Apply filter' }));
    expect(fetchList).toHaveBeenLastCalledWith({ name: 'filtered' });

    jest.mocked(useCategory).mockReturnValue(hookValue([category], false, true) as never);
    rerender(<CategoryListPage />);
    expect(jest.mocked(Table)).toHaveBeenCalled();
    expect(jest.mocked(Pagination)).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(goToPage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: 'finance.category.create.title' }));
    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
      title: 'finance.category.create.title',
    }));
    const createModal = openModal.mock.calls.at(-1)?.[0] as { children: React.ReactElement<{
      onSubmit: (data: { name: string }) => Promise<void>;
    }> };
    persist.mockResolvedValueOnce(undefined);
    await createModal.children.props.onSubmit({ name: category.name });
    expect(persist).toHaveBeenCalledWith({ name: category.name });
    expect(closeModal).toHaveBeenCalled();

    const table = jest.mocked(Table).mock.calls.at(-1)?.[0] as unknown as {
      actions: { icons: Array<{ onClick: (item: typeof category) => void }> };
    };
    table.actions.icons[0]?.onClick(category);
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      title: `finance.category.edit.title, {name: ${category.name}}`,
    }));
  });

  it('renders payer empty and data states with create and edit actions', () => {
    const { rerender } = render(<PayerPage />);
    expect(fetchList).toHaveBeenCalledWith({ page: '1' });
    expect(screen.getByText('finance.payer.empty')).toBeTruthy();

    jest.mocked(usePayer).mockReturnValue(hookValue([payer]) as never);
    rerender(<PayerPage />);
    expect(jest.mocked(Table)).toHaveBeenCalled();
    jest.mocked(usePayer).mockReturnValue(hookValue([payer], false, true) as never);
    rerender(<PayerPage />);
    expect(jest.mocked(Pagination)).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'finance.payer.create.title' }));
    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
      title: 'finance.payer.create.title',
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(goToPage).toHaveBeenCalledWith(2);
    const table = jest.mocked(Table).mock.calls.at(-1)?.[0] as unknown as {
      actions: { icons: Array<{ onClick: (item: typeof payer) => void }> };
    };
    table.actions.icons[0]?.onClick(payer);
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      title: `finance.payer.edit.title, {name: ${payer.name}}`,
    }));
  });

  it('renders beneficiary data and triggers filters and pagination', () => {
    render(<BeneficiaryPage />);
    expect(fetchList).toHaveBeenCalledWith({ page: '1' });
    expect(jest.mocked(Table)).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Apply filter' }));
    expect(fetchList).toHaveBeenLastCalledWith({ name: 'filtered' });
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(goToPage).toHaveBeenCalledWith(2);
    const table = jest.mocked(Table).mock.calls.at(-1)?.[0] as unknown as {
      actions: { icons: Array<{ onClick: (item: typeof beneficiary) => void }> };
    };
    table.actions.icons[0]?.onClick(beneficiary);
    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
      title: `finance.beneficiary.edit.title, {name: ${beneficiary.name}}`,
    }));
  });

  it.each(['source', 'destination'] as const)(
    'filters and paginates %s institutions and opens an edit modal',
    (type) => {
      render(<InstitutionList type={type} />);
      expect(fetchList).toHaveBeenCalledWith({ institution_type: type });
      fireEvent.click(screen.getByRole('button', { name: 'Apply filter' }));
      expect(fetchList).toHaveBeenLastCalledWith({
        name: 'filtered',
        institution_type: type,
      });
      fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(goToPage).toHaveBeenCalledWith(2, { institution_type: type });
      expect(jest.mocked(Table)).toHaveBeenCalled();
      const table = jest.mocked(Table).mock.calls.at(-1)?.[0] as unknown as {
        actions: { icons: Array<{ onClick: (item: typeof institution) => void }> };
      };
      table.actions.icons[0]?.onClick(institution);
      expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
        title: `finance.institution.edit.title, {name: ${institution.name}}`,
      }));
    },
  );
});
