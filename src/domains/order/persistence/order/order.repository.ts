import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import { Repository } from 'typeorm';
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
  ) {
    super(repository, new OrderOrmMapper(), unitOfWork, correlationId);
  }
}
