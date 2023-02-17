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
  publish(
    event: Event,
    correlationId: string,
  ): Promise<Result<any, Exception>> | void;

  publishBulk(
    events: Event[],
    correlationId: string,
  ): Promise<Result<any, Exception>> | void;

  register(eventTokens: string[], handler: Handler): void;
}
