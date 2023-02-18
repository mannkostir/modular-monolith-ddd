import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { UserRepository } from '@src/domains/identity/persistence/user/user.repository';
import { UserSchema } from '@src/infrastructure/database/schema/user.schema';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    throw new Error('Not implemented');
  }

  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository {
    throw new Error('Not implemented');
  }

  public getUserRepository(correlationId: string): UserRepository {
    return new UserRepository(
      this.getOrmRepository(UserSchema, correlationId),
      this,
      correlationId,
    );
  }
}
