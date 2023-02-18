import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';
import { Order } from '@src/infrastructure/database/types/order.type';
import {
  OrderEntity,
  OrderProps,
} from '@src/domains/order/domain/entities/order.entity';
import { OrderedItemOrmMapper } from '@src/domains/order/persistence/ordered-item/ordered-item.orm-mapper';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { DataSource } from 'typeorm';

export class OrderOrmMapper extends OrmMapper<OrderEntity, OrderProps, Order> {
  dataSource: DataSource;

  constructor(dataSource: DataSource) {
    super();
    this.dataSource = dataSource;
  }

  protected getEntityConstructor(
    ormEntity: Order,
  ): new (props: any) => OrderEntity {
    return OrderEntity;
  }

  protected async toDomainProps(ormEntity: Order): Promise<OrderProps> {
    return {
      orderedItems: await Promise.all(
        ormEntity.orderedItems.map((orderedItem) =>
          new OrderedItemOrmMapper(this.dataSource).toDomainEntity(orderedItem),
        ),
      ),
      customerId: new UuidVO(ormEntity.customerId),
      orderStatus: ormEntity.orderStatus,
    };
  }

  protected async toOrmProps(
    entity: OrderEntity,
  ): Promise<OrmEntityProps<Order>> {
    const props = entity.getCopiedProps();

    return {
      customerId: props.customerId.value,
      orderedItems: await Promise.all(
        props.orderedItems.map((orderedItem) =>
          new OrderedItemOrmMapper(this.dataSource).toOrmEntity(orderedItem),
        ),
      ),
      orderStatus: props.orderStatus,
    };
  }
}
