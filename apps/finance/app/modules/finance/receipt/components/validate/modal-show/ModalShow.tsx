import { Money } from '@machado-repo/shared';
import { Text } from '@machado-repo/ui';

import { TReceiptConfirm } from '@/app/modules/finance/receipt';

type ModalShowProps = {
  item: TReceiptConfirm;
}

export default function ModalShow({ item }: ModalShowProps) {
  return (
    <div>
      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.fine.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.fine ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.payer.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.payer}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.barcode.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.barcode}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.due_date.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.due_date?.toLocaleDateString() ?? '--'}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.discount.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.discount ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.interest.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.interest ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.paid_amount.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.paid_amount ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.beneficiary.name.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.beneficiary}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.total_charges.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.total_charges ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.authentication.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.authentication ?? '--'}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.transaction_id.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.transaction_id ?? '--'}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.effective_payer.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.effective_payer ?? '--'}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.receipt.document_amount.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {Money.tryCreate(item.document_amount ?? 0).instance.formatted}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.payment.source_institution.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.source_institution ?? '--'}</Text>
      </div>

      <div className="flex flex-row">
        <Text weight="bold">finance.payment.destination_institution.label</Text>
        <Text weight="bold">:&nbsp;</Text>
        <Text> {item.destination_institution ?? '--'}</Text>
      </div>
    </div>
  );
}