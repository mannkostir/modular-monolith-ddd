import { IHandleEvents } from './handle-events.interface';
import { IHandleEventsAsync } from '@lib/interfaces/common/handle-events-async.interface';
import { Result } from '@lib/utils/result.util';
import { IEvent } from '@lib/base/common/event';
import { Exception } from '@lib/base/common/exception';

export interface IPublishEvents<
  Event extends IEvent,
  Handler extends
    | IHandleEvents<Event>
    | IHandleEventsAsync<Event> = IHandleEvents<Event>,
> {
  publish(event: Event): Promise<Result<unknown, Exception>> | void;

  publishBulk(events: Event[]): Promise<Result<unknown, Exception>> | void;

  register(evenToken: string, handler: Handler): void;
}
