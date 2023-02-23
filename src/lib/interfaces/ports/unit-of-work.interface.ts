import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { IProvideTransactionalOutboxRepository } from '@lib/interfaces/common/provide-transactional-outbox.interface';
import { IProvideSagaRepository } from '@lib/interfaces/common/provide-saga-repository.interface';

export interface IUnitOfWork
  extends IProvideTransactionalOutboxRepository,
    IProvideSagaRepository {
  aggregates: Map<string, AggregateRoot<Record<string, unknown>>[]>;

  execute<TReturnType = unknown, TExceptionType extends Exception = Exception>(
    correlationId: string,
    callback: () => Promise<Result<unknown, Exception>>,
    options?: unknown,
  ): Promise<Result<TReturnType, TExceptionType>>;
}
