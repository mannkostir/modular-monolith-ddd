import { OutboxMessageStatus } from '@src/infrastructure/database/types/outbox-message-status.type';
import { IMessage } from '@lib/types/message.type';

export type OutboxMessage<T extends Record<string, unknown>> = {
  id: string;
  status: OutboxMessageStatus;
} & IMessage<T>;
