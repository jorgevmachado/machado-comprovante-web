import { useMemo, useCallback } from 'react';
import { Money } from '@machado-repo/shared';
import { Text } from '@machado-repo/ui';

import { TReceiptConfirm } from '@/app/modules/finance/receipt';

type ReceiptInfoExtractedDataProps = {
  item: TReceiptConfirm;
}

type ReceiptInfoExtractedDataListItem = {
  label: string;
  value: string;
}

export default function ReceiptInfoExtractedData({ item }: ReceiptInfoExtractedDataProps) {
  const formatValue = useCallback((key: string, value: string | number | Date | null | undefined): string => {
    if(key === 'fine' || key === 'discount' || key === 'interest' || key === 'paid_amount' || key === 'total_charge') {
      return Money.tryCreate(Number(value ?? 0)).instance.formatted;
    }

    if((key === 'due_date' || key === 'payment_date') && value) {
      return new Date(value).toLocaleDateString();
    }

    if(!value) {
      return '--';
    }

    return value.toString();
  }, []);

  const formatLabel = useCallback((key: string): string => {
    if(key === 'beneficiary') {
      return 'finance.beneficiary.name.label';
    }
    if(key === 'payment_date') {
      return 'finance.payment.date.label';
    }

    if(key === 'source_institution') {
      return 'finance.payment.source_institution.label';
    }

    if(key === 'destination_institution') {
      return 'finance.payment.destination_institution.label';
    }

    return `finance.receipt.${key}.label`
  }, []);

  const list = useMemo(() => {
    const data: Array<ReceiptInfoExtractedDataListItem> = [];
    Object.entries(item).forEach(([key, value]) => {
      if(key === 'id') {
        return;
      }
      data.push({
        label: formatLabel(key),
        value: formatValue(key, value)
      })
    });
    return data;
  }, [formatValue, formatLabel, item]);

  return (
    <div>
      {list.map((item) => (
        <div key={item.label} className="flex flex-row">
          <Text weight="bold">{item.label}</Text>
          <Text weight="bold">:&nbsp;</Text>
          <Text>{item.value}</Text>
        </div>
      ))}
    </div>
  )
}