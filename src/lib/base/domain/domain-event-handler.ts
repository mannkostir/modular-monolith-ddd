import { CommandBus, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { IHandleEvents } from '@lib/interfaces/common/handle-events.interface';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { Inject, Injectable } from '@nestjs/common';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';

@Injectable()
export abstract class DomainEventHandler<
  UnitOfWork extends IUnitOfWork = IUnitOfWork,
  Event extends DomainEvent = DomainEvent,
> implements IHandleEvents<Event>, IEventHandler
{
  constructor(
    @Inject(ProviderTokens.unitOfWork)
    protected readonly unitOfWork: UnitOfWork,
    @Inject(ProviderTokens.domainEventsPublisher)
    protected readonly domainEventsPublisher: DomainEventsPublisher,
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
  ) {
    const eventTokens: string[] = Reflect.getMetadata(
      'listenToEvents',
      this.constructor,
    );
    this.domainEventsPublisher.register(eventTokens, this);
  }

  abstract handle(event: Event): Promise<Result<unknown, Exception>>;
}
