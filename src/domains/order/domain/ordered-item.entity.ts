import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { PartialBy } from '@lib/types/partial-by.type';

export type OrderedItemProps = {
  orderId: UuidVO;
  itemId: UuidVO;
  quantity: number;
};

export type CreateOrderedItemProps = PartialBy<OrderedItemProps, 'quantity'>;

export class OrderedItemEntity extends AggregateRoot<OrderedItemProps> {
  public static create(createProps: CreateOrderedItemProps): OrderedItemEntity {
    return new OrderedItemEntity({ props: { ...createProps, quantity: 1 } });
  }
}
