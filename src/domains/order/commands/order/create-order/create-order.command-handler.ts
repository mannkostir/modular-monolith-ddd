import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { CreateOrderCommand } from '@lib/communication/gateway-interface/order/commands/create-order/create-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { OrderEntity } from '@src/domains/order/domain/entities/order.entity';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { OrderSaveFailedDomainException } from '@src/domains/order/domain/errors/order-save-failed.domain-exception';
import { EntityId } from '@lib/communication/gateway-interface/api-types/entity-id.api-type';

@CqrsCommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: CreateOrderCommand,
  ): Promise<Result<EntityId, InvalidOperationDomainError>> {
    const orderRepository = this.unitOfWork.getOrderRepository(
      command.correlationId,
    );

    const order = OrderEntity.create({
      customerId: new UuidVO(command.payload.customerId),
    });

    const saveResult = await orderRepository.save(order);
    if (saveResult.isErr)
      return Result.fail(new OrderSaveFailedDomainException());

    return Result.ok({ id: saveResult.unwrap().id.value });
  }
}
