import { fireEvent, render, screen } from '@testing-library/react';
import { FileUpload } from '@machado-repo/ui';

import ReceiptBatch from '../components/receipt-batch/ReceiptBatch';
import useReceiptsHook from '../hooks/useReceipts';

jest.mock('@machado-repo/ui', () => ({
  Button: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  ),
  FileUpload: jest.fn(({ value, onFilesChange }: {
    value: Array<File>;
    onFilesChange: (files: Array<File>) => void;
  }) => (
    <button onClick={() => onFilesChange([new File(['data'], 'receipt.pdf')])}>
      {`files:${value.length}`}
    </button>
  )),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('../hooks/useReceipts', () => jest.fn());

describe('ReceiptBatch', () => {
  const receiptBatchUpload = jest.fn();
  const onCallback = jest.fn();

  beforeEach(() => {
    jest.mocked(useReceiptsHook).mockReturnValue({ receiptBatchUpload } as never);
  });

  afterEach(() => jest.clearAllMocks());

  it('uploads selected files, clears them on success and reports success', async () => {
    receiptBatchUpload.mockResolvedValueOnce(true);
    render(<ReceiptBatch onCallback={onCallback} />);

    fireEvent.click(screen.getByRole('button', { name: 'files:0' }));
    expect(screen.getByText('Total: 1')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'files:1' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'form.action.send' }));
    expect(await screen.findByText('Total: 0')).toBeTruthy();
    expect(receiptBatchUpload).toHaveBeenCalledWith([expect.any(File)]);
    expect(onCallback).toHaveBeenCalledWith('success');
    expect(jest.mocked(FileUpload)).toHaveBeenCalled();
  });

  it('keeps selected files after failure and supports an omitted callback', async () => {
    receiptBatchUpload.mockResolvedValueOnce(false);
    render(<ReceiptBatch />);

    fireEvent.click(screen.getByRole('button', { name: 'files:0' }));
    fireEvent.click(screen.getByRole('button', { name: 'form.action.send' }));

    expect(await screen.findByText('Total: 1')).toBeTruthy();
    expect(onCallback).not.toHaveBeenCalled();
  });
});
