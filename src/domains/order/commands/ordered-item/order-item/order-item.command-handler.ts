import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { OrderItemCommand } from './order-item.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { OrderedItemEntity } from '@src/domains/order/domain/ordered-item.entity';
import { UuidVOFactory } from '@lib/value-objects/uuid.value-object';

@CqrsCommandHandler(OrderItemCommand)
export class OrderItemCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: OrderItemCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const orderedItemRepository = this.unitOfWork.getOrderedItemRepository(
      command.correlationId,
    );

    const orderedItem = OrderedItemEntity.create({
      orderId: new UuidVOFactory().create(command.payload.orderId),
      itemId: new UuidVOFactory().create(command.payload.itemId),
      quantity: command.payload.quantity,
    });

    const saveResult = await orderedItemRepository.save(orderedItem);
    if (saveResult.isErr) return Result.fail(new InvalidOperationDomainError());

    return Result.ok();
  }
}
