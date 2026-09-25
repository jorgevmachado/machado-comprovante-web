import { PaymentService } from './service';

export type { PaymentServiceDateParams,PaymentsInfoResponse } from './types';

export const paymentService: PaymentService = new PaymentService();

