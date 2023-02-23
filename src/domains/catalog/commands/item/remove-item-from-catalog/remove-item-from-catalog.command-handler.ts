import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/catalog/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { RemoveItemFromCatalogCommand } from './remove-item-from-catalog.command';
import { Result } from '@lib/utils/result.util';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { DomainException } from '@lib/base/common/domain.exception';

@CqrsCommandHandler(RemoveItemFromCatalogCommand)
export class RemoveItemFromCatalogCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: RemoveItemFromCatalogCommand,
  ): Promise<Result<void, DomainException>> {
    const itemRepository = this.unitOfWork.getItemsRepository(
      command.correlationId,
    );

    const item = await itemRepository.findOneById(
      new UuidVO(command.payload.itemId),
    );
    if (!item)
      return Result.fail(new EntityNotFoundDomainError('Товар не найден'));

    item.markAsRemoved();

    const removeResult = await itemRepository.removeOne(item);
    if (removeResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Неудачная попытка удаления'),
      );

    return Result.ok();
  }
}
