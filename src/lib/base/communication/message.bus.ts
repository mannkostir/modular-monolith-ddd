import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { IMessage } from '@lib/types/message.type';
import { MessageTokens } from '@lib/types/message-tokens.type';

export class MessageBus {
  private static instance: MessageBus | undefined = undefined;
  private subscribers: Map<MessageTokens, IHandleMessage[]> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): MessageBus {
    if (!this.instance) {
      this.instance = new MessageBus();
    }
    return this.instance;
  }

  public register(message: MessageTokens, handler: IHandleMessage): void {
    if (!this.subscribers.get(message)) {
      this.subscribers.set(message, []);
    }
    (this.subscribers.get(message) || []).push(handler);
  }

  public publish(message: IMessage): void {
    this._publish(message);
  }

  public publishAll(events: IMessage[]): void {
    events.forEach((event) => this._publish(event));
  }

  private _publish(message: IMessage) {
    if (this.subscribers.has(message.token)) {
      (this.subscribers.get(message.token) || []).forEach((handler) =>
        handler.handle(message),
      );
    }
  }
}
