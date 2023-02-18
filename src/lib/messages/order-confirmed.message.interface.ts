import { IMessage } from '@lib/types/message.type';

export type OrderConfirmedPayload = {
  total: number;
  orderId: string;
};

export type IOrderConfirmedMessage = IMessage<OrderConfirmedPayload>;
