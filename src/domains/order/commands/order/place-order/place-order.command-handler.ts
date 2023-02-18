import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { PlaceOrderCommand } from '@src/domains/order/commands/order/place-order/place-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrderNotFoundDomainException } from '@src/domains/order/domain/errors/order-not-found.domain-exception';
import { OrderSaveFailedDomainException } from '@src/domains/order/domain/errors/order-save-failed.domain-exception';

@CqrsCommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: PlaceOrderCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = await orderRepository.findOneById(
      new UuidVO(command.payload.orderId),
    );
    if (!order) return Result.fail(new OrderNotFoundDomainException());

    const placeResult = order.place();
    if (placeResult.isErr) return placeResult;

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr)
      return Result.fail(new OrderSaveFailedDomainException());

    return Result.ok();
  }
}
