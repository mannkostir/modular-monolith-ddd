import { ICommandHandler } from '@nestjs/cqrs';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { Command } from './command';
import { Injectable, Type } from '@nestjs/common';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { DomainException } from '@lib/base/common/domain.exception';

@Injectable()
export abstract class CommandHandler<
  UnitOfWork extends IUnitOfWork,
  TReturnType = any,
  TExceptionType extends Exception = DomainException,
> implements ICommandHandler
{
  private providerTokenToPropertyNameMap = new Map<string | Type, symbol>();

  public constructor(protected readonly moduleRef: ModuleRef) {}

  protected get domainEventsPublisher(): DomainEventsPublisher {
    return this.getProvider(ProviderTokens.domainEventsPublisher);
  }

  protected get asyncDomainEventsPublisher(): DomainEventsAsyncPublisher {
    return this.getProvider(ProviderTokens.asyncDomainEventsPublisher);
  }

  protected get configServer(): ConfigService {
    return this.getProvider(ConfigService);
  }

  protected get unitOfWork(): UnitOfWork {
    return this.getProvider<UnitOfWork>(ProviderTokens.unitOfWork);
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

  private getProvider<ProviderType>(token: string | Type): ProviderType {
    let fieldName: symbol;
    if (this.providerTokenToPropertyNameMap.has(token)) {
      fieldName = this.providerTokenToPropertyNameMap.get(token) as symbol;
    } else {
      fieldName = Symbol();
      this.providerTokenToPropertyNameMap.set(token, fieldName);
    }

    if (!this[fieldName]) {
      this[fieldName] = this.moduleRef.get(token);
      if (!this[fieldName]) throw new Error('Unit Of Work not provided');
    }
    return this[fieldName];
  }
}
