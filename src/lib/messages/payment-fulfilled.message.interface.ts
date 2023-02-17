import { Message } from '@lib/base/communication/message';

export type PaymentFulfilledMessagePayload = {
  paymentId: string;
};

export type IPaymentFulfilledMessage = Message<PaymentFulfilledMessagePayload>;
