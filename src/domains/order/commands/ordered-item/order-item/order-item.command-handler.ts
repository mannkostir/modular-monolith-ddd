import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { OrderItemCommand } from '@lib/communication/gateway-interface/order/commands/order-item/order-item.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { Exception } from '@lib/base/common/exception';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';

@CqrsCommandHandler(OrderItemCommand)
export class OrderItemCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(command: OrderItemCommand): Promise<Result<void, Exception>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order)
      return Result.fail(new EntityNotFoundDomainError('Заказ не найден'));

    order.addItem(new UuidVO(command.payload.itemId), command.payload.quantity);

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr) return Result.fail(new InvalidOperationDomainError());

    return Result.ok();
  }
}
