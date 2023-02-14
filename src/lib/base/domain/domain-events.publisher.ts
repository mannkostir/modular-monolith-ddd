import { DomainEvent } from './domain-event';
import { EventsPublisher } from '@lib/base/common/events.publisher';
import { IHandleEvents } from '@lib/interfaces/common/handle-events.interface';

export class DomainEventsPublisher extends EventsPublisher<
  DomainEvent,
  IHandleEvents<DomainEvent>
> {}
