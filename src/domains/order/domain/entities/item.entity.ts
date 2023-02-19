import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { RubMoneyVO } from '@lib/value-objects/money.value-object';

export type ItemProps = {
  price: RubMoneyVO;
};

export type CreateItemProps = ItemProps & { id?: UuidVO };

export class ItemEntity extends AggregateRoot<ItemProps> {
  public get price(): RubMoneyVO {
    return this.props.price;
  }

  public static create(createProps: CreateItemProps): ItemEntity {
    return new ItemEntity({ props: createProps });
  }
}
