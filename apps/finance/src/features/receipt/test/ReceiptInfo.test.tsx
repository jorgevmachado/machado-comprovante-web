import { act, render, screen } from '@testing-library/react';
import { useModal, type ModalProps } from '@machado-repo/ui';

import ReceiptInfo from '../components/info/ReceiptInfo';
import ReceiptInfoList from '../components/info/list';
import { Receipt } from '../domain/Receipt';
import useReceipts from '../hooks/useReceipts';
import {
  EReceiptFieldStatus,
  EReceiptProcessingStatus,
} from '../types';
import type { TReceiptConfirm, TReceiptData } from '../types';
import { Category } from '../../category/domain/Category';

jest.mock('@machado-repo/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useModal: jest.fn(),
}));

jest.mock('../components/total-receipts', () => jest.fn(() => null));
jest.mock('../components/info/list', () => jest.fn(() => null));
jest.mock('../hooks/useReceipts', () => jest.fn());

const extractedData: TReceiptData = {
  fine: { value: 1, status: EReceiptFieldStatus.FOUND },
  payer: { value: 'Payer', status: EReceiptFieldStatus.FOUND },
  barcode: { value: '123', status: EReceiptFieldStatus.FOUND },
  due_date: { value: new Date('2026-10-01'), status: EReceiptFieldStatus.FOUND },
  discount: { value: 0, status: EReceiptFieldStatus.FOUND },
  category: { value: 'Utilities', status: EReceiptFieldStatus.FOUND },
  interest: { value: 0, status: EReceiptFieldStatus.FOUND },
  description: { value: 'Electricity', status: EReceiptFieldStatus.FOUND },
  paid_amount: { value: 75, status: EReceiptFieldStatus.FOUND },
  beneficiary: { value: 'Power Co.', status: EReceiptFieldStatus.FOUND },
  payment_date: { value: new Date('2026-10-02'), status: EReceiptFieldStatus.FOUND },
  total_charges: { value: 75, status: EReceiptFieldStatus.FOUND },
  authentication: { value: 'auth', status: EReceiptFieldStatus.FOUND },
  transaction_id: { value: 'transaction', status: EReceiptFieldStatus.FOUND },
  effective_payer: { value: 'Payer', status: EReceiptFieldStatus.FOUND },
  document_amount: { value: 75, status: EReceiptFieldStatus.FOUND },
  source_institution: { value: 'Bank A', status: EReceiptFieldStatus.FOUND },
  destination_institution: { value: 'Bank B', status: EReceiptFieldStatus.FOUND },
};

function createReceipt(id: string, status: EReceiptProcessingStatus) {
  return Receipt.create({
    id,
    file_name: `${id}.pdf`,
    file_type: 'application/pdf',
    file_size: '1024',
    created_at: new Date('2026-10-08T10:00:00.000Z'),
    extracted_data: extractedData,
    processing_status: status,
  });
}

function listPropsAt(index: number) {
  const props = jest.mocked(ReceiptInfoList).mock.calls[index]?.[0];
  if (!props) {
    throw new Error('Expected a receipt list to be rendered.');
  }
  return props;
}

describe('ReceiptInfo', () => {
  const confirmReceipt = jest.fn();
  const updateReceipt = jest.fn();
  const openModal = jest.fn();
  const closeModal = jest.fn();
  const onCallback = jest.fn();
  const category = Category.create({
    id: 'category-1',
    name: 'Utilities',
    created_at: new Date('2026-10-08T10:00:00.000Z'),
  });

  beforeEach(() => {
    jest.mocked(useReceipts).mockReturnValue({
      confirmReceipt,
      updateReceipt,
    } as never);
    jest.mocked(useModal).mockReturnValue({
      modal: null,
      openModal,
      closeModal,
    } as never);
  });

  afterEach(() => jest.resetAllMocks());

  it('renders receipt groups and opens edit, details and confirmation modals', async () => {
    const received = createReceipt('received', EReceiptProcessingStatus.RECEIVED);
    const failed = createReceipt('failed', EReceiptProcessingStatus.FAILED);
    const processing = createReceipt('processing', EReceiptProcessingStatus.PROCESSING);
    confirmReceipt.mockResolvedValueOnce(true);
    const receipts = [received, failed, processing];

    render(<ReceiptInfo receipts={receipts} categories={[category]} onCallback={onCallback} />);

    expect(jest.mocked(ReceiptInfoList)).toHaveBeenCalledTimes(3);
    expect(listPropsAt(0).type).toBe(EReceiptProcessingStatus.RECEIVED);
    expect(listPropsAt(1).type).toBe(EReceiptProcessingStatus.FAILED);
    expect(listPropsAt(2).type).toBe(EReceiptProcessingStatus.PROCESSING);

    listPropsAt(0).onEdit?.(received as unknown as TReceiptConfirm);
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      title: 'finance.receipt.edit.title',
    }));
    listPropsAt(0).onShow?.(received as unknown as TReceiptConfirm);
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      title: 'finance.receipt.show.title',
    }));

    listPropsAt(0).onConfirm?.(received as unknown as TReceiptConfirm);
    const confirmation = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    expect(confirmation.title).toBe('finance.receipt.confirm.title');
    await act(async () => {
      await confirmation.footer?.primary?.onClick?.(
        {} as React.MouseEvent<HTMLButtonElement>,
      );
    });
    expect(confirmReceipt).toHaveBeenCalledWith(received);
    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(onCallback).toHaveBeenCalledWith('success');

    listPropsAt(1).onEdit?.(failed as unknown as TReceiptConfirm);
    const editModal = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    expect(editModal.title).toBe('finance.receipt.edit.title');
  });

  it('persists failed receipts and handles errors when updates or confirmations fail', async () => {
    const failed = createReceipt('failed', EReceiptProcessingStatus.FAILED);
    const receiptConfirm: TReceiptConfirm = {
      id: failed.id,
      category: 'Utilities',
      beneficiary: 'Power Co.',
      paid_amount: 75,
      source_institution: 'Bank A',
    };
    updateReceipt.mockResolvedValueOnce({
      ...failed,
      processing_status: EReceiptProcessingStatus.PROCESSED,
      extracted_data: extractedData,
    });
    confirmReceipt.mockResolvedValueOnce(false);
    const received = createReceipt('received', EReceiptProcessingStatus.RECEIVED);
    render(<ReceiptInfo receipts={[received, failed]} categories={[]} onCallback={onCallback} />);

    listPropsAt(1).onEdit?.(receiptConfirm);
    const editModal = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    const form = editModal.children as React.ReactElement<{
      onSubmit: (item: TReceiptConfirm, data: TReceiptData) => Promise<void>;
    }>;
    await act(async () => {
      await form.props.onSubmit(receiptConfirm, extractedData);
    });
    expect(updateReceipt).toHaveBeenCalledWith(receiptConfirm);
    expect(onCallback).toHaveBeenCalledWith('success');
    expect(closeModal).toHaveBeenCalled();

    listPropsAt(0).onConfirm?.(receiptConfirm);
    const confirmation = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    await act(async () => {
      await confirmation.footer?.primary?.onClick?.(
        {} as React.MouseEvent<HTMLButtonElement>,
      );
    });
    expect(onCallback).toHaveBeenLastCalledWith('error');
  });

  it('edits a received receipt without persisting and closes the confirmation from cancel', async () => {
    const received = createReceipt('received', EReceiptProcessingStatus.RECEIVED);
    render(<ReceiptInfo receipts={[received]} categories={[category]} />);

    listPropsAt(0).onEdit?.(received as unknown as TReceiptConfirm);
    const editModal = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    const form = editModal.children as React.ReactElement<{
      onSubmit: (item: TReceiptConfirm, data: TReceiptData) => Promise<void>;
    }>;
    await act(async () => {
      await form.props.onSubmit(received as unknown as TReceiptConfirm, extractedData);
    });

    expect(updateReceipt).not.toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalledTimes(1);

    listPropsAt(0).onConfirm?.(received as unknown as TReceiptConfirm);
    const confirmation = openModal.mock.calls.at(-1)?.[0] as ModalProps;
    await act(async () => {
      await confirmation.footer?.secondary?.onClick?.(
        {} as React.MouseEvent<HTMLButtonElement>,
      );
    });
    expect(closeModal).toHaveBeenCalledTimes(2);
  });

  it('shows receipts when data arrives after an initially empty render', async () => {
    const received = createReceipt('received', EReceiptProcessingStatus.RECEIVED);
    const { rerender } = render(<ReceiptInfo receipts={[]} categories={[]} />);

    rerender(<ReceiptInfo receipts={[received]} categories={[]} />);

    await act(async () => {});
    expect(jest.mocked(ReceiptInfoList)).toHaveBeenCalledWith(
      expect.objectContaining({ type: EReceiptProcessingStatus.RECEIVED }),
      undefined,
    );
  });

  it('renders the empty-state message when there are no receipts', () => {
    render(<ReceiptInfo receipts={[]} categories={[]} />);

    expect(screen.getByText('finance.receipt.info.no-receipts')).toBeTruthy();
    expect(jest.mocked(ReceiptInfoList)).not.toHaveBeenCalled();
  });
});
