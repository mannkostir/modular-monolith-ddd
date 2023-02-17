import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  ItemEntity,
  ItemProps,
} from '@src/domains/catalog/domain/entities/item.entity';
import { Item } from '@src/infrastructure/database/types/item.type';
import { Repository } from 'typeorm';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { ItemOrmMapper } from '@src/domains/catalog/persistence/item/item.orm-mapper';

export class ItemRepository extends TypeormRepository<
  ItemEntity,
  ItemProps,
  Item
> {
  constructor(
    repository: Repository<Item>,
    unitOfWOrk: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new ItemOrmMapper(), unitOfWOrk, correlationId);
  }
}
