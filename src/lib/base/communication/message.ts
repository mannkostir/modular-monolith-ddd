import { IMessage } from '@lib/types/message.type';

export type MessageMeta = {
  dateOccurred: Date;
  correlationId: string;
};

export abstract class Message<
  Payload extends Record<string, any> = Record<string, any>,
> implements IMessage<Payload>
{
  context: string;
  correlationId: string;
  dateOccurred: Date;
  payload: Payload;
  token: string;

  constructor(
    meta: MessageMeta,
    payload: Payload,
    token: string,
    context: string,
  ) {
    this.context = context;
    this.payload = payload;
    this.correlationId = meta.correlationId;
    this.token = token;
    this.dateOccurred = meta.dateOccurred;
  }
}
