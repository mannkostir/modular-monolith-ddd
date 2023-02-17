import { IMessage } from '@lib/types/message.type';

export type RequestPaymentPayload = {
  amount: number;
};

export type IRequestPaymentMessage = IMessage<RequestPaymentPayload>;
