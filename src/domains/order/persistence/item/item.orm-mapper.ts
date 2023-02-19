import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  ItemEntity,
  ItemProps,
} from '@src/domains/order/domain/entities/item.entity';
import { Item } from '@src/infrastructure/database/types/item.type';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';
import { RubMoneyVO } from '@lib/value-objects/money.value-object';

export class ItemOrmMapper extends OrmMapper<ItemEntity, ItemProps, Item> {
  protected getEntityConstructor(ormEntity: Item): {
    new (props: any): ItemEntity;
  } {
    return ItemEntity;
  }

  protected async toDomainProps(ormEntity: Item): Promise<ItemProps> {
    return {
      price: new RubMoneyVO(ormEntity.price),
    };
  }

  protected async toOrmProps(
    entity: ItemEntity,
  ): Promise<OrmEntityProps<Item>> {
    return {};
  }
}
