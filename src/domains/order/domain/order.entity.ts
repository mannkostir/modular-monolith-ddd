import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { OrderedItemEntity } from '@src/domains/order/domain/ordered-item.entity';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export type OrderProps = {
  customerId: UuidVO;
  orderedItems: OrderedItemEntity[];
};

export type CreateOrderProps = Pick<OrderProps, 'customerId'>;

export class OrderEntity extends AggregateRoot<OrderProps> {
  public static create(createProps: CreateOrderProps): OrderEntity {
    return new OrderEntity({ props: { ...createProps, orderedItems: [] } });
  }

  addItem(
    itemId: UuidVO,
    quantity: number,
  ): Result<void, InvalidOperationDomainError> {
    if (quantity <= 0) {
      return Result.fail(
        new InvalidOperationDomainError(
          'Нельзя добавить товар с количеством 0 или меньше',
        ),
      );
    }

    const alreadyOrderedItem = this.props.orderedItems.find(
      (orderedItem) => orderedItem,
    );

    if (alreadyOrderedItem) {
      alreadyOrderedItem.increaseQuantity(quantity);
      return Result.ok();
    }

    this.props.orderedItems.push(
      OrderedItemEntity.create({ orderId: this.id, itemId, quantity }),
    );

    return Result.ok();
  }
}
