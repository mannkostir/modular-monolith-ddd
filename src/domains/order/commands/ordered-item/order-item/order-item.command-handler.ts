import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { OrderItemCommand } from '@src/domains/order/commands/ordered-item/order-item/order-item.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { DomainException } from '@lib/base/common/domain.exception';

@CqrsCommandHandler(OrderItemCommand)
export class OrderItemCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: OrderItemCommand,
  ): Promise<Result<void, DomainException>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );
    const itemRepository = this.unitOfWork.getItemRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order)
      return Result.fail(new EntityNotFoundDomainError('Заказ не найден'));

    const item = await itemRepository.findOneById(
      new UuidVO(command.payload.itemId),
    );
    if (!item)
      return Result.fail(
        new EntityNotFoundDomainError('Товар для заказа не найден'),
      );

    const addItemResult = order.addItem(item, command.payload.quantity);
    if (addItemResult.isErr) return addItemResult;

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr) return Result.fail(new InvalidOperationDomainError());

    return Result.ok();
  }
}
