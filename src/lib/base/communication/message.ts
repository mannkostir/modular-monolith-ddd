import { IMessage } from '@lib/types/message.type';
import { MessageTokens } from '@lib/types/message-tokens.type';

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
  token: MessageTokens;

  constructor(
    meta: MessageMeta,
    payload: Payload,
    token: MessageTokens,
    context: string,
  ) {
    this.context = context;
    this.payload = payload;
    this.correlationId = meta.correlationId;
    this.token = token;
    this.dateOccurred = meta.dateOccurred;
  }
}
