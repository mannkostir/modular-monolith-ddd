import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { Inject, Injectable } from '@nestjs/common';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { IHandleEvents } from '@lib/interfaces/common/handle-events.interface';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { IMessage } from '@lib/types/message.type';

@Injectable()
export abstract class DomainEventMapper<
  UnitOfWork extends IUnitOfWork = IUnitOfWork,
> implements IHandleEvents<DomainEvent>
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

  abstract execute(
    event: DomainEvent,
  ): Promise<Result<IMessage, Exception>> | Result<IMessage, Exception>;

  public async handle(event: DomainEvent): Promise<Result<void, Exception>> {
    const result = await this.execute(event);
    if (result.isErr) {
      return result;
    }

    const eventsOutboxRepository =
      this.unitOfWork.getTransactionalOutboxRepository(event.correlationId);
    await eventsOutboxRepository.add([result.unwrap()]);

    return Result.ok();
  }
}
