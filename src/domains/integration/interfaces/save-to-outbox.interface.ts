import { IMessage } from '@lib/types/message.type';

export interface ISaveToOutbox {
  save(message: IMessage): Promise<void>;
}
