import { Repository } from 'typeorm';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import { IMessage } from '@lib/types/message.type';
import { OutboxMessageStatus } from '@src/infrastructure/database/types/outbox-message-status.type';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export abstract class TransactionalOutboxTypeormRepository
  implements ITransactionalOutboxRepository
{
  constructor(private typeormRepository: Repository<OutboxMessage>) {}

  public async add(messages: IMessage[]): Promise<void> {
    await this.typeormRepository.save(
      messages.map((message) => {
        return this.toOutboxMessage(message);
      }),
    );
  }

  public async getPending(): Promise<OutboxMessage[]> {
    return await this.typeormRepository.find();
  }

  public async markAsProcessed(message: IMessage): Promise<void> {
    await this.typeormRepository.save(
      this.typeormRepository.create({
        ...this.toOutboxMessage(message),
        status: OutboxMessageStatus.processed,
      }),
    );
  }

  private toOutboxMessage(message: IMessage): OutboxMessage {
    return {
      status: OutboxMessageStatus.pending,
      correlationId: message.correlationId || UuidVO.generate().value,
      context: message.context,
      id: UuidVO.generate().value,
      token: message.token,
      dateOccurred: message.dateOccurred,
      payload: message.payload,
    };
  }
}
