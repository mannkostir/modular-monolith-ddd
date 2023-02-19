import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  OrderedItemEntity,
  OrderedItemProps,
} from '@src/domains/order/domain/entities/ordered-item.entity';
import { OrderedItem } from '@src/infrastructure/database/types/ordered-item.type';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';
import { DataSource } from 'typeorm';
import { RubMoneyVO } from '@lib/value-objects/money.value-object';

export class OrderedItemOrmMapper extends OrmMapper<
  OrderedItemEntity,
  OrderedItemProps,
  OrderedItem
> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  protected getEntityConstructor(
    ormEntity: OrderedItem,
  ): new (props: any) => OrderedItemEntity {
    return OrderedItemEntity;
  }

  protected async toDomainProps(
    ormEntity: OrderedItem,
  ): Promise<OrderedItemProps> {
    const item = await this.dataSource
      ?.createQueryBuilder()
      .select('i.price as price')
      .from('item', 'i')
      .where('i.id = :id', { id: ormEntity.itemId })
      .getRawOne<{ price: number }>();

    if (!item) throw new Error('Item does not found');

    return {
      item: {
        id: new UuidVO(ormEntity.itemId),
        price: new RubMoneyVO(item.price),
      },
      orderId: new UuidVO(ormEntity.orderId),
      quantity: ormEntity.quantity,
    };
  }

  protected async toOrmProps(
    entity: OrderedItemEntity,
  ): Promise<OrmEntityProps<OrderedItem>> {
    const props = entity.getCopiedProps();

    return {
      itemId: props.item.id.value,
      orderId: props.orderId.value,
      quantity: props.quantity,
    };
  }
}
