import { TReceipt ,TReceiptConfirm } from '@/app/modules/finance/receipt';
import { useMemo } from 'react';
import { Money } from '@machado-repo/shared';
import { Table } from '@machado-repo/ui';

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
        if (!data.payment_date || !data.payment_date.value) {
          return;
        }
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

  const tableActions = useMemo(() => {
    const icons = [];

    if(onEdit) {
      icons.push({ icon: 'edit' ,onClick: onEdit });
    }
    if(onShow) {
      icons.push({ icon: 'show' ,onClick: onShow });
    }
    if(onConfirm) {
      icons.push({ icon: 'confirm' ,onClick: onConfirm });
    }

    const actions = {
      text: 'form.action.actions' ,
      icons: icons
    };
    if(icons.length > 0) {
      return actions;
    }
    return undefined;
  },[onEdit,onShow,onConfirm])

  return (
    <div className={className}>
      <Table
        items={list}
        headers={[
          { value: 'payer', label: 'Payer' },
          { value: 'beneficiary', label: 'Beneficiary' },
          { value: 'payment_date', label: 'Payment Date' },
          { value: 'source_institution', label: 'Source Institution' },
          { value: 'destination_institution', label: 'Destination Institution' },
          { value: 'paid_amount', label: 'Paid Amount', format: (value) => Money.tryCreate(value).instance.formatted },
        ]}
        actions={tableActions}
      />
    </div>
  )
}