import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { PaymentRepository } from '@src/domains/payment/persistence/payment/payment.repository';
import { OrderOutboxMessageRepository } from '@src/domains/order/persistence/outbox/order.outbox-message.repository';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import { OrderOutboxMessageSchema } from '@src/infrastructure/database/schema/order.outbox-message.schema';
import { PaymentSchema } from '@src/infrastructure/database/schema/payment.schema';

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

  public getPaymentRepository(correlationId: string): PaymentRepository {
    return new PaymentRepository(
      this.getOrmRepository(PaymentSchema, correlationId),
      this,
      correlationId,
    );
  }
}
