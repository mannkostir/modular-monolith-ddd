import { MessageTokens } from '@lib/types/message-tokens.type';

export interface IMessage<
  Payload extends Record<string, unknown> = Record<string, unknown>,
> {
  token: MessageTokens;
  payload: Payload;
  correlationId: string;
  dateOccurred: Date;
  context: string;
}
