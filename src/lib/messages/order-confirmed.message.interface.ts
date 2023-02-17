import { IMessage } from '@lib/types/message.type';

type Payload = {
  total: number;
};

export type IOrderConfirmedMessage = IMessage<Payload>;
