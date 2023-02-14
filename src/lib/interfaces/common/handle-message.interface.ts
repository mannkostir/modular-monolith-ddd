import { IMessage } from '@lib/types/message.type';

export interface IHandleMessage<Message extends IMessage = IMessage> {
  handle: (message: Message) => Promise<void>;
}
