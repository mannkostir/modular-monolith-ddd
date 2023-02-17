import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { PartialBy } from '@lib/types/partial-by.type';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';

export type OrderedItemProps = {
  orderId: UuidVO;
  itemId: UuidVO;
  quantity: number;
};

export type CreateOrderedItemProps = PartialBy<OrderedItemProps, 'quantity'>;

export class OrderedItemEntity extends AggregateRoot<OrderedItemProps> {
  public get orderId(): UuidVO {
    return this.props.orderId;
  }

  public get itemId(): UuidVO {
    return this.props.itemId;
  }

  public static create(createProps: CreateOrderedItemProps): OrderedItemEntity {
    return new OrderedItemEntity({ props: { ...createProps, quantity: 1 } });
  }

  public increaseQuantity(
    incrementor: number,
  ): Result<void, InvalidOperationDomainError> {
    if (incrementor <= 0)
      return Result.fail(
        new InvalidOperationDomainError(
          'Нельзя прибавить 0 или меньше к количеству товаров',
        ),
      );

    this.props.quantity += incrementor;

    return Result.ok();
  }
}
