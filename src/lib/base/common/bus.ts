import { IHandleEvents } from '@lib/interfaces/common/handle-events.interface';
import { IPublishEvents } from '@lib/interfaces/common/publish-events.interface';
import { IEvent } from '@lib/base/common/event';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';

export abstract class Bus<
  Event extends IEvent,
  Handler extends IHandleEvents<Event>,
> implements IPublishEvents<Event, Handler>
{
  private subscribers: Map<string, Handler[]> = new Map();

  public constructor() {
    this.subscribers = new Map();
  }

  async publish(event: Event): Promise<Result<unknown, Exception>> {
    return this._publish(event);
  }

  async publishBulk(events: Event[]): Promise<Result<unknown, Exception>> {
    let lastOkResult: Result<unknown> = Result.ok();
    for (const event of events) {
      const result = await this.publish(event);
      if (result.isErr) {
        return result;
      }
      lastOkResult = result as Result.Ok<unknown>;
    }
    return lastOkResult;
  }

  register(eventTokens: string[], handler: Handler) {
    for (const eventToken of eventTokens) {
      if (!this.subscribers.get(eventToken)) {
        this.subscribers.set(eventToken, []);
      }
      (this.subscribers.get(eventToken) || []).push(handler);
    }
  }

  private async _publish(event: Event): Promise<Result<unknown, Exception>> {
    const eventToken = event.constructor.name;
    if (this.subscribers.has(eventToken)) {
      const results = await Promise.all(
        (this.subscribers.get(eventToken) || []).map((handler) =>
          handler.handle(event),
        ),
      );
      if (!results.length) return Result.ok();
      const erroredResult = results.find((result) => result.isErr);
      if (erroredResult) return erroredResult;
      return results.length ? results[results.length - 1] : Result.ok();
    }
    return Result.ok();
  }
}
