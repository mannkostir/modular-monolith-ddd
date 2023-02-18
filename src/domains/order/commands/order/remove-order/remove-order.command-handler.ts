import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { RemoveOrderCommand } from './remove-order.command';
import { Result } from '@lib/utils/result.util';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrderNotFoundDomainException } from '@src/domains/order/domain/errors/order-not-found.domain-exception';
import { DomainException } from '@lib/base/common/domain.exception';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';

@CqrsCommandHandler(RemoveOrderCommand)
export class RemoveOrderCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: RemoveOrderCommand,
  ): Promise<Result<void, DomainException>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order) return Result.fail(new OrderNotFoundDomainException());

    const removeOrderResult = order.remove();
    if (removeOrderResult.isErr) return removeOrderResult;

    const removeResult = await orderRepository.removeOne(order);
    if (removeResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Не удалось удалить заказ'),
      );

    return Result.ok();
  }
}
