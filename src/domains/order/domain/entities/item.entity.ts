import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export type ItemProps = {
  price: number;
};

export type CreateItemProps = ItemProps & { id?: UuidVO };

export class ItemEntity extends AggregateRoot<ItemProps> {
  public get price(): number {
    return this.props.price;
  }

  public static create(createProps: CreateItemProps): ItemEntity {
    return new ItemEntity({ props: createProps });
  }
}
