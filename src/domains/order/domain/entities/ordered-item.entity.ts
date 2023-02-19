import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { PartialBy } from '@lib/types/partial-by.type';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { Entity } from '@lib/base/domain/entity';
import { RubMoneyVO } from '@lib/value-objects/money.value-object';

export type OrderedItemProps = {
  orderId: UuidVO;
  item: { id: UuidVO; price: RubMoneyVO };
  quantity: number;
};

export type CreateOrderedItemProps = PartialBy<OrderedItemProps, 'quantity'>;

export class OrderedItemEntity extends Entity<OrderedItemProps> {
  public get orderId(): UuidVO {
    return this.props.orderId;
  }

  public get itemId(): UuidVO {
    return this.props.item.id;
  }

  public get price(): RubMoneyVO {
    return this.props.item.price;
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
