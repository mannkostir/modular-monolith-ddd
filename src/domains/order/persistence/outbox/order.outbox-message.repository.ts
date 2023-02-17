import { TransactionalOutboxTypeormRepository } from '@src/infrastructure/database/base/transactional-outbox.typeorm-repository';

export class OrderOutboxMessageRepository extends TransactionalOutboxTypeormRepository {}
