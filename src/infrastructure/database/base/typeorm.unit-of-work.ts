import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import {
  DataSource,
  EntityManager,
  EntitySchema,
  EntityTarget,
  QueryRunner,
  Repository,
} from 'typeorm';
import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { IPublishEvents } from '@lib/interfaces/common/publish-events.interface';
import { DomainEvent } from '@lib/base/domain/domain-event';
import { DomainEventHandler } from '@lib/base/domain/domain-event-handler';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Inject } from '@nestjs/common';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';

export abstract class TypeormUnitOfWork implements IUnitOfWork {
  aggregates: Map<string, AggregateRoot[]> = new Map();
  publishers: Map<string, IPublishEvents<DomainEvent, DomainEventHandler>> =
    new Map();
  private queryRunners: Map<string, QueryRunner> = new Map();

  constructor(
    @Inject(ProviderTokens.dataSource)
    protected readonly dataSource: DataSource,
  ) {}

  abstract getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository;

  abstract getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga;

  public getQueryRunner(correlationId?: string): QueryRunner {
    if (!correlationId) return this.dataSource.createQueryRunner();

    const queryRunner = this.queryRunners.get(correlationId);

    if (!queryRunner) {
      return this.dataSource.createQueryRunner();
    }

    return queryRunner;
  }

  public getManager(correlationId: string): EntityManager {
    return this.getQueryRunner(correlationId).manager;
  }

  public async execute<
    TReturnType = any,
    TExceptionType extends Exception = Exception,
  >(
    correlationId: string,
    callback: () => Promise<Result<unknown, Exception>>,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<Result<TReturnType, TExceptionType>> {
    const queryRunner = this.dataSource.createQueryRunner();
    this.queryRunners.set(correlationId, queryRunner);
    await queryRunner.startTransaction(options?.isolationLevel);

    try {
      const result = await callback();
      if (result.isErr) {
        console.error(result.safeUnwrap());
        await this.rollback(correlationId);
        await this.finish(correlationId);
      } else {
        await queryRunner.commitTransaction();
        await this.finish(correlationId);
      }

      return result as Result<TReturnType, TExceptionType>;
    } catch (err) {
      await this.rollback(correlationId);
      await this.finish(correlationId);
      throw err;
    }
  }

  public addAggregates(correlationId: string, entities: AggregateRoot[]) {
    this.aggregates.set(correlationId, [
      ...(this.aggregates.get(correlationId) || []),
      ...entities,
    ]);
  }

  protected getOrmRepository<Entity extends ObjectLiteral>(
    entity: EntitySchema<Entity> | EntityTarget<Entity>,
    correlationId?: string,
  ): Repository<Entity> {
    const queryRunner = this.getQueryRunner(correlationId);
    return queryRunner.manager.getRepository(entity);
  }

  private async rollback(correlationId: string) {
    const queryRunner = this.getQueryRunner(correlationId);

    await queryRunner.rollbackTransaction();
  }

  private async finish(correlationId: string) {
    const queryRunner = this.getQueryRunner(correlationId);
    await queryRunner.release();
    this.queryRunners.delete(correlationId);
    this.publishers.delete(correlationId);
    this.aggregates.delete(correlationId);
  }
}
