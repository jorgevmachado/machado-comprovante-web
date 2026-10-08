import {
  EReceiptProcessingStatus ,
  TReceipt ,
  TReceiptConfirm,
} from '../../../types';
import { useCallback ,useMemo } from 'react';
import { Money } from '@machado-repo/shared';
import { Table ,type TableProps ,Text ,useUI } from '@machado-repo/ui';

type TReceiptListItem = TReceiptConfirm & {
  file_name: string;
}

type ReceiptInfoListProps = {
  type: EReceiptProcessingStatus;
  onEdit?: (item: TReceiptConfirm) => void;
  onShow?: (item: TReceiptConfirm) => void;
  receipts: Array<TReceipt>;
  onConfirm?: (item: TReceiptConfirm) => void;
  className?: string;
}
export default function ReceiptInfoList({
  type,
  onEdit,
  onShow,
  receipts,
  onConfirm,
  className
}: ReceiptInfoListProps) {
  const { locale } = useUI();

  const list = useMemo(() => {
    const result: Array<TReceiptListItem> = [];
    receipts.forEach((receipt) => {
      if(receipt.extracted_data) {
        const data = {...receipt.extracted_data};
        result.push({
          id: receipt.id,
          file_name: receipt.file_name,
          fine: data.fine.value,
          payer: data.payer.value ?? '--',
          barcode: data.barcode.value,
          due_date: data.due_date.value,
          discount: data.discount.value,
          interest: data.interest.value,
          category: data.category.value ?? '--',
          description: data.description.value,
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
      category: item.category === '--' ? '' : item.category,
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
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-2 py-2">
        <Text weight="bold" size="2xl">{'finance.receipt.info.title'}:</Text>
        <Text size="2xl">{`finance.receipt.${type.toLowerCase()}`}</Text>
      </div>
      <div className="max-w-full overflow-x-auto rounded-xl">
        <Table
          items={list}
          headers={[
            { value: 'file_name', label: 'finance.receipt.file_name.label' },
            { value: 'payer', label: 'finance.receipt.payer.label' },
            { value: 'category', label: 'finance.category.name.label' },
            { value: 'beneficiary', label: 'finance.beneficiary.name.label' },
            { value: 'payment_date', label: 'finance.payment.date.label', format: (value) => value ? new Date(value).toLocaleDateString() : '' },
            { value: 'source_institution', label: 'finance.payment.source_institution.label' },
            { value: 'destination_institution', label: 'finance.payment.destination_institution.label' },
            { value: 'paid_amount', label: 'finance.receipt.paid_amount.label', format: (value) => Money.tryCreate(value, { locale }).instance.formatted },
          ]}
          actions={tableActions}
        />
      </div>
    </div>
  )
}