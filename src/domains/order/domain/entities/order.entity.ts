import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { OrderedItemEntity } from '@src/domains/order/domain/entities/ordered-item.entity';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrderStatus } from '@src/domains/order/domain/types/order-status.type';
import { OrderConfirmedDomainEvent } from '@src/domains/order/domain/events/order-confirmed.domain-event';

export type OrderProps = {
  customerId: UuidVO;
  orderedItems: OrderedItemEntity[];
  orderStatus: OrderStatus;
};

export type CreateOrderProps = Pick<OrderProps, 'customerId'>;

export class OrderEntity extends AggregateRoot<OrderProps> {
  protected get isPending(): boolean {
    return this.props.orderStatus === OrderStatus.pending;
  }

  protected get isCancelled(): boolean {
    return this.props.orderStatus === OrderStatus.cancelled;
  }

  protected get isPlaced(): boolean {
    return this.props.orderStatus === OrderStatus.placed;
  }

  public static create(createProps: CreateOrderProps): OrderEntity {
    return new OrderEntity({
      props: {
        ...createProps,
        orderedItems: [],
        orderStatus: OrderStatus.pending,
      },
    });
  }

  addItem(
    itemId: UuidVO,
    quantity: number,
  ): Result<void, InvalidOperationDomainError> {
    if (!this.isPending)
      return Result.fail(
        new InvalidOperationDomainError(
          'Нельзя добавить товар в заказ, который не находится в стадии ожидания',
        ),
      );

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

  confirm(): Result<void, InvalidOperationDomainError> {
    if (!this.isPending)
      return Result.fail(
        new InvalidOperationDomainError(
          'Нельзя подтвердить заказ, который уже не находится в стадии ожидания',
        ),
      );
    if (this.props.orderedItems.length <= 0)
      return Result.fail(
        new InvalidOperationDomainError(
          'Нельзя подтвердить заказ, в котором нет товаров',
        ),
      );

    this.props.orderStatus = OrderStatus.confirmed;

    this.addEvent(
      new OrderConfirmedDomainEvent({
        aggregateId: this.id.value,
        payload: { orderId: this.id.value },
      }),
    );

    return Result.ok();
  }

  cancel(): Result<void, InvalidOperationDomainError> {
    if (this.isCancelled)
      return Result.fail(
        new InvalidOperationDomainError('Нельзя отменить уже отменённый заказ'),
      );

    this.props.orderStatus = OrderStatus.cancelled;

    return Result.ok();
  }
}