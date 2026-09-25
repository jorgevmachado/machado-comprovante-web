import {
  PaymentsCount ,
  PaymentsList ,
  PaymentsMax ,
  PaymentsTotal ,
  type TPayment ,
} from '@/app/modules/finance/payment';

type PaymentsInfoProps = {
  title?: string;
  maxTitle?: string;
  payments: Array<TPayment>;
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
  maxPayment,
  countTitle ,
  totalTitle ,
  totalAmount,
  paymentCount
}: PaymentsInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        <PaymentsCount title={ countTitle } count={ paymentCount }/>
        <PaymentsTotal title={ totalTitle } total={ totalAmount }/>
        <PaymentsMax title={ maxTitle } maxValue={ maxPayment }/>
      </div>
      <PaymentsList title={ title } payments={ payments }/>
    </div>
  );
}