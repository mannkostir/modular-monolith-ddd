import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { PaymentRepository } from '@src/domains/payment/persistence/payment/payment.repository';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    throw new Error('Not implemented');
  }

  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository {
    throw new Error('Not implemented');
  }

  public getPaymentRepository(correlationId: string): PaymentRepository {
    return new PaymentRepository(
      this.getOrmRepository(correlationId),
      this,
      correlationId,
    );
  }
}
