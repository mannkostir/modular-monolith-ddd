import { IEventsPublisher } from '@lib/interfaces/common/events.publisher.interface';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { AsyncBus } from '@lib/base/common/async-bus';
import { IHandleEventsAsync } from '@lib/interfaces/common/handle-events-async.interface';
import { UuidVOFactory } from '@lib/value-objects/uuid.value-object';

export class DomainEventsAsyncPublisher
  implements IEventsPublisher<DomainEvent, IHandleEventsAsync<DomainEvent>>
{
  constructor(
    private bus: AsyncBus<DomainEvent, IHandleEventsAsync<DomainEvent>>,
  ) {}

  public publish(event: DomainEvent, correlationId: string): void {
    event.correlationId = correlationId;
    return this.bus.publish(event);
  }

  publishBulk(events: DomainEvent[], correlationId: string): void {
    return this.bus.publishBulk(
      events.map((event) => {
        event.correlationId =
          correlationId || new UuidVOFactory().generate().value;
        return event;
      }),
    );
  }

  register(
    eventTokens: string[],
    handler: IHandleEventsAsync<DomainEvent>,
  ): void {
    eventTokens.map((eventToken) => this.bus.register(eventToken, handler));
  }
}
