import { IMessage } from '@lib/types/message.type';

export type RequestPaymentPayload = {
  amount: number;

  invoiceId: string;
};

export type IRequestPaymentMessage = IMessage<RequestPaymentPayload>;
