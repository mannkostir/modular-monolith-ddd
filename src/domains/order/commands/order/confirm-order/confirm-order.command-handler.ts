import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { ConfirmOrderCommand } from '@src/domains/order/commands/order/confirm-order/confirm-order.command';
import { Result } from '@lib/utils/result.util';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { OrderSaveFailedDomainException } from '@src/domains/order/domain/errors/order-save-failed.domain-exception';
import { DomainException } from '@lib/base/common/domain.exception';

@CqrsCommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: ConfirmOrderCommand,
  ): Promise<Result<void, DomainException>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order)
      return Result.fail(new EntityNotFoundDomainError('Заказ не найден'));

    const confirmResult = order.confirm();
    if (confirmResult.isErr) return confirmResult;

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr)
      return Result.fail(new OrderSaveFailedDomainException());

    return Result.ok();
  }
}
