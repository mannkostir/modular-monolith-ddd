import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import { DataSource, Repository } from 'typeorm';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { Order } from '@src/infrastructure/database/types/order.type';
import {
  OrderEntity,
  OrderProps,
} from '@src/domains/order/domain/entities/order.entity';
import { OrderOrmMapper } from '@src/domains/order/persistence/order/order.orm-mapper';

export class OrderRepository extends TypeormRepository<
  OrderEntity,
  OrderProps,
  Order
> {
  constructor(
    repository: Repository<Order>,
    unitOfWork: TypeormUnitOfWork,
    correlationId: string,
    dataSource: DataSource,
  ) {
    super(
      repository,
      new OrderOrmMapper(dataSource),
      unitOfWork,
      correlationId,
    );
  }
}
