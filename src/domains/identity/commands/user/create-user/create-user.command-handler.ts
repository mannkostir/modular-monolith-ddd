import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/identity/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { CreateUserCommand } from './create-user.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UserEntity } from '@src/domains/identity/domain/entities/user.entity';

@CqrsCommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: CreateUserCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const userRepository = this.unitOfWork.getUserRepository(
      command.correlationId,
    );

    const user = UserEntity.create({
      email: command.payload.email,
      password: command.payload.password,
    });

    const saveResult = await userRepository.save(user);
    if (saveResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Не удалось сохранить пользователя'),
      );

    return Result.ok();
  }
}
