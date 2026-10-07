import { Text } from '@machado-repo/ui';

import {
  PaymentsList ,
  type TPayment ,
} from '@/app/modules/finance/payment';

type PaymentsInfoProps = {
  title?: string;
  payments: Array<TPayment>;
  isLoading: boolean;
}

export default function PaymentsInfo({
  title = 'finance.payment.recent.title' ,
  payments,
  isLoading,
}: PaymentsInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <Text weight="bold" size="3xl">{title}</Text>
      <PaymentsList payments={ payments } isLoading={isLoading}/>
    </div>
  );
}