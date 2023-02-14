import { IHandleEvents } from '../common/handle-events.interface';
import { IPublishEvents } from '../common/publish-events.interface';
import { DomainEvent } from '@lib/base/domain/domain-event';

export type IDomainEventsBus = IPublishEvents<
  DomainEvent,
  IHandleEvents<DomainEvent>
>;
