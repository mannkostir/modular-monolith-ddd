import { IEventHandler } from '@nestjs/cqrs';
import { Bus } from '@lib/base/common/bus';
import { IEvent } from '@lib/base/common/event';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { IPublishEvents } from '@lib/interfaces/common/publish-events.interface';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export abstract class EventsPublisher<
  TEvent extends IEvent,
  THandler extends IEventHandler,
> implements IPublishEvents<TEvent, THandler>
{
  constructor(private bus: Bus<TEvent, THandler>) {}

  public async publish(
    event: TEvent,
    correlationId: string,
  ): Promise<Result<any, Exception>> {
    event.correlationId = correlationId;
    return this.bus.publish(event);
  }

  async publishBulk(
    events: TEvent[],
    correlationId: string,
  ): Promise<Result<any, Exception>> {
    return this.bus.publishBulk(
      events.map((event) => {
        event.correlationId = correlationId || UuidVO.generate().value;
        return event;
      }),
    );
  }

  register(eventTokens: string[], handler: THandler): void {
    eventTokens.map((eventToken) => this.bus.register([eventToken], handler));
  }
}
