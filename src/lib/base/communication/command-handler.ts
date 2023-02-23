import { ICommandHandler } from '@nestjs/cqrs';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { Command } from './command';
import { Injectable } from '@nestjs/common';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { DomainException } from '@lib/base/common/domain.exception';
import { ProvidersPool } from '@lib/base/communication/providers-pool';

@Injectable()
export abstract class CommandHandler<
  UnitOfWork extends IUnitOfWork,
  TReturnType = any,
  TExceptionType extends Exception = DomainException,
> implements ICommandHandler
{
  private readonly providersPool: ProvidersPool;

  public constructor(protected readonly moduleRef: ModuleRef) {
    this.providersPool = new ProvidersPool(moduleRef);
  }

  protected get domainEventsPublisher(): DomainEventsPublisher {
    return this.providersPool.getProvider(ProviderTokens.domainEventsPublisher);
  }

  protected get asyncDomainEventsPublisher(): DomainEventsAsyncPublisher {
    return this.providersPool.getProvider(
      ProviderTokens.asyncDomainEventsPublisher,
    );
  }

  protected get configServer(): ConfigService {
    return this.providersPool.getProvider(ConfigService);
  }

  protected get unitOfWork(): UnitOfWork {
    return this.providersPool.getProvider<UnitOfWork>(
      ProviderTokens.unitOfWork,
    );
  }

  public execute(
    command: Command,
  ): Promise<Result<TReturnType, TExceptionType>> {
    return this.unitOfWork.execute(command.correlationId, async () => {
      const result: Result<TReturnType, Exception> = await this.handle(command);
      if (result.isErr) return result;

      const correlationAggregates =
        this.unitOfWork.aggregates.get(command.correlationId) || [];

      const results = await Promise.all(
        correlationAggregates
          .filter((aggregate) => !aggregate.isDomainProcessed)
          .map(async (aggregate) => {
            aggregate.isDomainProcessed = true;
            if (!aggregate.domainEvents.length) return Result.ok();
            return await this.domainEventsPublisher.publishBulk(
              aggregate.domainEvents,
              command.correlationId,
            );
          }),
      );

      const erroredResult = results.find((result) => result?.isErr);
      if (erroredResult) return erroredResult;

      for (const aggregate of correlationAggregates) {
        if (!aggregate.domainEvents.length) continue;

        this.asyncDomainEventsPublisher.publishBulk(
          aggregate.domainEvents,
          command.correlationId,
        );
      }

      correlationAggregates.forEach((aggregate) => aggregate.clearEvents());

      return result;
    });
  }

  protected abstract handle(
    command: Command,
  ): Promise<Result<TReturnType, TExceptionType>>;
}
