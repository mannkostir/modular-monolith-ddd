import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  ItemEntity,
  ItemProps,
} from '@src/domains/order/domain/entities/item.entity';
import { Item } from '@src/infrastructure/database/types/item.type';
import { Repository } from 'typeorm';
import { ItemOrmMapper } from '@src/domains/order/persistence/item/item.orm-mapper';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';

export class ItemRepository extends TypeormRepository<
  ItemEntity,
  ItemProps,
  Item
> {
  constructor(
    repository: Repository<Item>,
    unitOfWork: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new ItemOrmMapper(), unitOfWork, correlationId);
  }
}
