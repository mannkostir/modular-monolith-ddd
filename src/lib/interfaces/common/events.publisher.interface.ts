import { IEventHandler } from '@nestjs/cqrs';
import { IEvent } from '@lib/base/common/event';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';

export interface IEventsPublisher<
  TEvent extends IEvent,
  THandler extends IEventHandler,
> {
  publish(
    event: TEvent,
    correlationId: string,
  ): Promise<Result<any, Exception>> | void;

  publishBulk(
    events: TEvent[],
    correlationId: string,
  ): Promise<Result<any, Exception>> | void;

  register(eventTokens: string[], handler: THandler): void;
}
