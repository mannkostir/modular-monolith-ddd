import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { OrderRepository } from '@src/domains/order/persistence/order/order.repository';
import { OrderSchema } from '@src/infrastructure/database/schema/order.schema';
import { SagaRepository } from '@src/domains/integration/persistence/saga.repository';
import { OrderSagaSchema } from '@src/infrastructure/database/schema/order-saga.schema';
import { PersistedSaga } from '@src/domains/integration/interfaces/persisted-saga.interface';
import { OrderOutboxMessageRepository } from '@src/domains/order/persistence/outbox/order.outbox-message.repository';
import { OrderOutboxMessageSchema } from '@src/infrastructure/database/schema/order.outbox-message.schema';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import { ItemRepository } from '@src/domains/order/persistence/item/item.repository';
import { ItemSchema } from '@src/infrastructure/database/schema/item.schema';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    return new SagaRepository(
      this.getOrmRepository<PersistedSaga>(OrderSagaSchema, correlationId),
    );
  }

  getTransactionalOutboxRepository(
    correlationId?: string,
  ): ITransactionalOutboxRepository {
    return new OrderOutboxMessageRepository(
      this.getOrmRepository<OutboxMessage>(
        OrderOutboxMessageSchema,
        correlationId,
      ),
    );
  }

  public getOrderRepository(correlationId: string): OrderRepository {
    return new OrderRepository(
      this.getOrmRepository(OrderSchema),
      this,
      correlationId,
      this.dataSource,
    );
  }

  public getItemRepository(correlationId: string): ItemRepository {
    return new ItemRepository(
      this.getOrmRepository(ItemSchema),
      this,
      correlationId,
    );
  }
}
