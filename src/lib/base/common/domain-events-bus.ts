import { Bus } from '@lib/base/common/bus';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { DomainEventHandler } from '@lib/base/domain/domain-event-handler';

export class DomainEventsBus extends Bus<DomainEvent, DomainEventHandler> {}
