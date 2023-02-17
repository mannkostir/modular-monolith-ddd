import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { OrderedItemRepository } from '@src/domains/order/persistence/ordered-item/ordered-item.repository';
import { OrderedItemSchema } from '@src/infrastructure/database/schema/ordered-item.schema';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    throw new Error('Not implemented');
  }

  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository {
    throw new Error('Not implemented');
  }

  public getOrderedItemRepository(
    correlationId: string,
  ): OrderedItemRepository {
    return new OrderedItemRepository(
      this.getOrmRepository(OrderedItemSchema),
      this,
      correlationId,
    );
  }
}
