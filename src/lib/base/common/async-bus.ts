import { IEvent } from '@lib/base/common/event';
import { IHandleEventsAsync } from '@lib/interfaces/common/handle-events-async.interface';
import { IPublishEvents } from '@lib/interfaces/common/publish-events.interface';
import { OnModuleDestroy } from '@nestjs/common';

export class AsyncBus<
  Event extends IEvent,
  Handler extends IHandleEventsAsync<Event>,
> implements IPublishEvents<Event, Handler>, OnModuleDestroy
{
  private subscribers: Map<string, Handler[]> = new Map();

  public constructor() {
    this.subscribers = new Map();
  }

  publish(event: Event): void {
    return this._publish(event);
  }

  publishBulk(events: Event[]): void {
    for (const event of events) {
      this.publish(event);
    }
  }

  register(eventTokens: string[], handler: Handler) {
    for (const eventToken of eventTokens) {
      if (!this.subscribers.get(eventToken)) {
        this.subscribers.set(eventToken, []);
      }

      (this.subscribers.get(eventToken) || []).push(handler);
    }
  }

  onModuleDestroy(): void {
    this.subscribers.clear();
  }

  private _publish(event: Event): void {
    const eventToken = event.constructor.name;
    if (this.subscribers.has(eventToken)) {
      for (const subscriber of this.subscribers.get(eventToken) || []) {
        subscriber.handle(event).catch((err) => console.error(err));
      }
    }
  }
}
