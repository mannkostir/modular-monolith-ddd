import { AsyncBus } from '@lib/base/common/async-bus';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { AsyncDomainEventHandler } from '@lib/base/domain/async-domain-event-handler';

export class AsyncDomainEventsBus extends AsyncBus<
  DomainEvent,
  AsyncDomainEventHandler
> {}
