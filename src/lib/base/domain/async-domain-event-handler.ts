import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { Inject, Injectable } from '@nestjs/common';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { Result } from '@lib/utils/result.util';
import { IHandleEventsAsync } from '@lib/interfaces/common/handle-events-async.interface';
import { ProviderTokens } from '@lib/types/provider-tokens.type';

@Injectable()
export abstract class AsyncDomainEventHandler<
  UnitOfWork extends IUnitOfWork = IUnitOfWork,
  Event extends DomainEvent = DomainEvent,
> implements IHandleEventsAsync<Event>
{
  constructor(
    @Inject(ProviderTokens.unitOfWork)
    protected readonly unitOfWork: UnitOfWork,
    @Inject(ProviderTokens.asyncDomainEventsPublisher)
    protected readonly domainEventsPublisher: DomainEventsAsyncPublisher,
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
  ) {
    const eventTokens: string[] = Reflect.getMetadata(
      'listenToAsyncEvents',
      this.constructor,
    );
    this.domainEventsPublisher.register(eventTokens, this);
  }

  abstract execute(
    event: DomainEvent,
  ): Promise<Result<void, InvalidOperationDomainError>>;

  public async handle(event: DomainEvent): Promise<void> {
    const result = await this.execute(event);
  }
}
