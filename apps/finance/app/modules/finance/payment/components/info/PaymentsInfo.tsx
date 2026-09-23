import {
  PaymentsCount ,
  type PaymentsInfoResponse ,
  PaymentsList ,
  PaymentsMax ,
  PaymentsTotal ,
} from '@/app/modules/finance/payment';

type PaymentsInfoProps = {
  info: PaymentsInfoResponse;
  title?: string;
  maxTitle?: string;
  countTitle?: string;
  totalTitle?: string;
}

export default function PaymentsInfo({
  info ,
  title = 'finance.payment.recent.title' ,
  maxTitle ,
  countTitle ,
  totalTitle ,
}: PaymentsInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        <PaymentsCount title={ countTitle } count={ info.count }/>
        <PaymentsTotal title={ totalTitle } total={ info.total }/>
        <PaymentsMax title={ maxTitle } maxValue={ info.maxValue }/>
      </div>
      <PaymentsList title={ title } payments={ info.payments }/>
    </div>
  );
}