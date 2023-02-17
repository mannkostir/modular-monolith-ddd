import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { ItemRepository } from '@src/domains/catalog/persistence/item/item.repository';
import { ItemSchema } from '@src/infrastructure/database/schema/item.schema';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { OrderOutboxMessageRepository } from '@src/domains/order/persistence/outbox/order.outbox-message.repository';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import { OrderOutboxMessageSchema } from '@src/infrastructure/database/schema/order.outbox-message.schema';

export class UnitOfWork extends TypeormUnitOfWork {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    throw new Error('Not implemented');
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

  getItemsRepository(correlationId: string): ItemRepository {
    return new ItemRepository(
      this.getOrmRepository(ItemSchema, correlationId),
      this,
      correlationId,
    );
  }
}
