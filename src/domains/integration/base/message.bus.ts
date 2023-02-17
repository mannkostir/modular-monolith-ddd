import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { IMessage } from '@lib/types/message.type';

export class MessageBus {
  private static instance: MessageBus | undefined = undefined;
  private subscribers: Map<string, IHandleMessage[]> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): MessageBus {
    if (!this.instance) {
      this.instance = new MessageBus();
    }
    return this.instance;
  }

  public register(message: string, handler: IHandleMessage): void {
    const subscribers = this.subscribers.get(message);

    if (!subscribers) {
      this.subscribers.set(message, []);
    }
    (subscribers as IHandleMessage[]).push(handler);
  }

  public publish(message: IMessage): void {
    this._publish(message);
  }

  public publishAll(events: IMessage[]): void {
    events.forEach((event) => this._publish(event));
  }

  private _publish(message: IMessage) {
    if (this.subscribers.has(message.token)) {
      (this.subscribers.get(message.token) as IHandleMessage[]).forEach(
        (handler) => handler.handle(message),
      );
    }
  }
}
