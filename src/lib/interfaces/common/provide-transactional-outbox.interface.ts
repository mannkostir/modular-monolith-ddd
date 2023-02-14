import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';

export interface IProvideTransactionalOutboxRepository {
  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository;
}
