import {
  PaymentsCount ,
  PaymentsList ,
  PaymentsMax ,
  PaymentsTotal ,
  type TPayment ,
} from '@/app/modules/finance/payment';
import { Text } from '@machado-repo/ui';

type PaymentsInfoProps = {
  title?: string;
  maxTitle?: string;
  payments: Array<TPayment>;
  isLoading: boolean;
  maxPayment: number;
  countTitle?: string;
  totalTitle?: string;
  totalAmount: number;
  paymentCount: number;
}

export default function PaymentsInfo({
  title = 'finance.payment.recent.title' ,
  maxTitle ,
  payments,
  isLoading,
  maxPayment,
  countTitle ,
  totalTitle ,
  totalAmount,
  paymentCount
}: PaymentsInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {!isLoading && (
        <div className="flex flex-row gap-6">
          <PaymentsCount title={ countTitle } count={ paymentCount }/>
          <PaymentsTotal title={ totalTitle } total={ totalAmount }/>
          <PaymentsMax title={ maxTitle } maxValue={ maxPayment }/>
        </div>
      )}
      <Text weight="bold" size="3xl">{title}</Text>
      <PaymentsList payments={ payments } isLoading={isLoading}/>
    </div>
  );
}