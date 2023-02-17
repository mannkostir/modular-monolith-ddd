import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { ConfirmOrderCommand } from './confirm-order.command';
import { Result } from '@lib/utils/result.util';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { Exception } from '@lib/base/common/exception';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';

@CqrsCommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(command: ConfirmOrderCommand): Promise<Result<void, Exception>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order)
      return Result.fail(new EntityNotFoundDomainError('Заказ не найден'));

    order.confirm();

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Не удалось подтвердить заказ'),
      );

    return Result.ok();
  }
}
