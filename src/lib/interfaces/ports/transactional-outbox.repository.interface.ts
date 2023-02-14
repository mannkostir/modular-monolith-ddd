import { IMessage } from '@lib/types/message.type';

export interface ITransactionalOutboxRepository {
  add(messages: IMessage[]): Promise<void>;

  getPending(): Promise<IMessage[]>;

  markAsProcessed(message: IMessage): Promise<void>;
}
