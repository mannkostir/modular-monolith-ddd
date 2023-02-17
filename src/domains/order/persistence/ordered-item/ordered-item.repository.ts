import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  OrderedItemEntity,
  OrderedItemProps,
} from '@src/domains/order/domain/ordered-item.entity';
import { OrderedItem } from '@src/infrastructure/database/types/ordered-item.type';
import { Repository } from 'typeorm';
import { OrderedItemOrmMapper } from '@src/domains/order/persistence/ordered-item/ordered-item.orm-mapper';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';

export class OrderedItemRepository extends TypeormRepository<
  OrderedItemEntity,
  OrderedItemProps,
  OrderedItem
> {
  constructor(
    repository: Repository<OrderedItem>,
    unitOfWork: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new OrderedItemOrmMapper(), unitOfWork, correlationId);
  }
}
