import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { OrderRepository } from '@src/domains/order/persistence/order/order.repository';
import { OrderSchema } from '@src/infrastructure/database/schema/order.schema';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    throw new Error('Not implemented');
  }

  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository {
    throw new Error('Not implemented');
  }

  public getOrderRepository(correlationId: string): OrderRepository {
    return new OrderRepository(
      this.getOrmRepository(OrderSchema),
      this,
      correlationId,
    );
  }
}
