import { UnitOfWork } from '@src/domains/catalog/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { AddItemToCatalogCommand } from './add-item-to-catalog.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ItemEntity } from '@src/domains/catalog/domain/entities/item.entity';

export class AddItemToCatalogCommandHandler extends CommandHandler<
  UnitOfWork,
  void,
  InvalidOperationDomainError
> {
  protected async handle(
    command: AddItemToCatalogCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const itemRepository = this.unitOfWork.getItemsRepository(
      command.correlationId,
    );

    const item = ItemEntity.create(command.payload);

    const saveResult = await itemRepository.save(item);

    if (saveResult.isErr) return Result.fail(new InvalidOperationDomainError());

    return Result.ok();
  }
}
