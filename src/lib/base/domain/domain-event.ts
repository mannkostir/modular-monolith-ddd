import { Event, EventProps } from '@lib/base/common/event';
import { DateVOFactory } from '@lib/value-objects/date.value-object';

export type DomainEventProps<Payload extends Record<string, any>> =
  EventProps<Payload>;

export abstract class DomainEvent<
  Payload extends Record<string, any> = Record<string, any>,
> extends Event<Payload> {
  constructor(props: DomainEventProps<Payload>) {
    super(props);
    this.dateOccurred = new DateVOFactory().now.date;
  }
}
