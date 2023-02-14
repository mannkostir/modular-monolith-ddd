import { ICommandHandler } from '@nestjs/cqrs';
import { IUnitOfWork } from '../../interfaces/ports/unit-of-work.interface';
import { Command } from './command';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';

@Injectable()
export abstract class CommandHandler<
  UnitOfWork extends IUnitOfWork,
  ReturnType = unknown,
> implements ICommandHandler, OnModuleInit
{
  private _configService: ConfigService | undefined;

  public constructor(protected readonly moduleRef: ModuleRef) {}

  private _domainEventsPublisher: DomainEventsPublisher | undefined;

  protected get domainEventsPublisher(): DomainEventsPublisher {
    if (!this._domainEventsPublisher)
      throw new Error('Domain Events Publisher not provided');
    return this._domainEventsPublisher;
  }

  private _asyncDomainEventsPublisher: DomainEventsAsyncPublisher | undefined;

  protected get asyncDomainEventsPublisher(): DomainEventsAsyncPublisher {
    if (!this._asyncDomainEventsPublisher)
      throw new Error('Domain Events Async Publisher not provided');
    return this._asyncDomainEventsPublisher;
  }

  protected get configServer(): ConfigService {
    if (!this._configService) throw new Error('Config Service not provided');
    return this._configService;
  }

  private _unitOfWork: UnitOfWork | undefined;

  protected get unitOfWork(): UnitOfWork {
    if (!this._unitOfWork) throw new Error('Unit Of Work not provided');
    return this._unitOfWork;
  }

  onModuleInit() {
    this._unitOfWork = this.moduleRef.get(ProviderTokens.unitOfWork);
    this._domainEventsPublisher = this.moduleRef.get(
      ProviderTokens.domainEventsPublisher,
    );
    this._asyncDomainEventsPublisher = this.moduleRef.get(
      ProviderTokens.asyncDomainEventsPublisher,
    );
    this._configService = this.moduleRef.get(ConfigService);
  }

  abstract handle(command: Command): Promise<Result<ReturnType, Exception>>;

  public execute(command: Command): Promise<Result<unknown, Exception>> {
    return this.unitOfWork.execute(command.correlationId, async () => {
      const result: Result<ReturnType, Exception> = await this.handle(command);
      if (result.isErr) return result;

      const correlationAggregates =
        this.unitOfWork.aggregates.get(command.correlationId) || [];

      const results = await Promise.all(
        correlationAggregates
          .filter((aggregate) => !aggregate.isDomainProcessed)
          .map(async (aggregate) => {
            aggregate.isDomainProcessed = true;
            if (!aggregate.domainEvents.length) return Result.ok();
            const publishResult = await this.domainEventsPublisher.publishBulk(
              aggregate.domainEvents,
              command.correlationId,
            );
            return publishResult;
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
}
