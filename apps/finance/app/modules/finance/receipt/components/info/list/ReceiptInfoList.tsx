import { TReceipt ,TReceiptConfirm } from '@/app/modules/finance/receipt';
import { useCallback ,useMemo } from 'react';
import { Money } from '@machado-repo/shared';
import { Table, type TableProps } from '@machado-repo/ui';

type ReceiptInfoListProps = {
  onEdit?: (item: TReceiptConfirm) => void;
  onShow?: (item: TReceiptConfirm) => void;
  receipts: Array<TReceipt>;
  onConfirm?: (item: TReceiptConfirm) => void;
  className?: string;
}
export default function ReceiptInfoList({
  onEdit,
  onShow,
  receipts,
  onConfirm,
  className
}: ReceiptInfoListProps) {

  const list = useMemo(() => {
    const result: Array<TReceiptConfirm> = [];
    receipts.forEach((receipt) => {
      if(receipt.extracted_data) {
        const data = {...receipt.extracted_data};
        result.push({
          id: receipt.id,
          fine: data.fine.value,
          payer: data.payer.value ?? '--',
          barcode: data.barcode.value,
          due_date: data.due_date.value,
          discount: data.discount.value,
          interest: data.interest.value,
          paid_amount: data.paid_amount.value ?? 0,
          beneficiary: data.beneficiary.value ?? '--',
          payment_date: data.payment_date.value,
          total_charges: data.total_charges.value,
          authentication: data.authentication.value,
          transaction_id: data.transaction_id.value,
          effective_payer: data.effective_payer.value,
          document_amount: data.document_amount.value,
          source_institution: data.source_institution.value ?? '--',
          destination_institution: data.destination_institution.value ?? '--',
        })

      }
    });
    return result;
  }, [receipts]);

  const formatItem = useCallback((item: TReceiptConfirm) => {
    return {
      ...item,
      payer: item.payer === '--' ? '' : item.payer,
      barcode: item.barcode === '--' ? '' : item.barcode,
      beneficiary: item.beneficiary === '--' ? '' : item.beneficiary,
      authentication: item.authentication === '--' ? '' : item.authentication,
      transaction_id: item.transaction_id === '--' ? '' : item.transaction_id,
      effective_payer: item.effective_payer === '--' ? '' : item.effective_payer,
      source_institution: item.source_institution === '--' ? '' : item.source_institution,
      destination_institution: item.destination_institution === '--' ? '' : item.destination_institution,
    }
  }, []);

  const tableActions = useMemo(() => {
    const icons  = [];

    if(onEdit) {
      icons.push({ icon: 'edit' ,onClick: (item: TReceiptConfirm) => onEdit(formatItem(item)) });
    }
    if(onShow) {
      icons.push({ icon: 'show' ,onClick: (item: TReceiptConfirm) => onShow(formatItem(item)) });
    }
    if(onConfirm) {
      icons.push({ icon: 'confirm' ,onClick: (item: TReceiptConfirm) => onConfirm(formatItem(item)), tone: 'success' });
    }

    const actions = {
      text: 'form.action.actions' ,
      icons
    };
    if(icons.length > 0) {
      return actions as TableProps<TReceiptConfirm>['actions'];
    }
    return undefined;
  },[onEdit, onShow, onConfirm, formatItem])

  return (
    <div className={className}>
      <Table
        items={list}
        headers={[
          { value: 'payer', label: 'Payer' },
          { value: 'beneficiary', label: 'Beneficiary' },
          { value: 'payment_date', label: 'Payment Date', format: (value) => value ? new Date(value).toLocaleDateString() : '' },
          { value: 'source_institution', label: 'Source Institution' },
          { value: 'destination_institution', label: 'Destination Institution' },
          { value: 'paid_amount', label: 'Paid Amount', format: (value) => Money.tryCreate(value).instance.formatted },
        ]}
        actions={tableActions}
      />
    </div>
  )
}