import { Message } from '@lib/base/communication/message';

export type PaymentRejectedMessagePayload = {
  paymentId: string;
};

export type IPaymentRejectedMessage = Message<PaymentRejectedMessagePayload>;
