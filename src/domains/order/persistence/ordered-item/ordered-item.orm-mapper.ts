import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  OrderedItemEntity,
  OrderedItemProps,
} from '@src/domains/order/domain/entities/ordered-item.entity';
import { OrderedItem } from '@src/infrastructure/database/types/ordered-item.type';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';

export class OrderedItemOrmMapper extends OrmMapper<
  OrderedItemEntity,
  OrderedItemProps,
  OrderedItem
> {
  protected getEntityConstructor(
    ormEntity: OrderedItem,
  ): new (props: any) => OrderedItemEntity {
    return OrderedItemEntity;
  }

  protected async toDomainProps(
    ormEntity: OrderedItem,
  ): Promise<OrderedItemProps> {
    return {
      itemId: new UuidVO(ormEntity.itemId),
      orderId: new UuidVO(ormEntity.orderId),
      quantity: ormEntity.quantity,
    };
  }

  protected async toOrmProps(
    entity: OrderedItemEntity,
  ): Promise<OrmEntityProps<OrderedItem>> {
    const props = entity.getCopiedProps();

    return {
      itemId: props.itemId.value,
      orderId: props.orderId.value,
      quantity: props.quantity,
    };
  }
}
