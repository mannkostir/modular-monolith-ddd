import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/identity/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { CreateUserCommand } from '@src/domains/identity/commands/user/create-user/create-user.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { UserEntity } from '@src/domains/identity/domain/entities/user.entity';
import { EmailVO } from '@lib/value-objects/email.value-object';
import { ConflictDomainError } from '@lib/errors/conflict.domain.exception';
import { PasswordVO } from '@src/domains/identity/domain/value-objects/password.value-object';

@CqrsCommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: CreateUserCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const userRepository = this.unitOfWork.getUserRepository(
      command.correlationId,
    );

    const doesUserExist = await userRepository.doesExist({
      email: new EmailVO(command.payload.email),
    });
    if (doesUserExist)
      return Result.fail(
        new ConflictDomainError('Пользователь с таким email уже существует'),
      );

    const user = UserEntity.create({
      email: new EmailVO(command.payload.email),
      password: await PasswordVO.generate(command.payload.password),
    });

    const saveResult = await userRepository.save(user);
    if (saveResult.isErr) {
      console.error(saveResult.safeUnwrap());
      return Result.fail(
        new InvalidOperationDomainError('Не удалось сохранить пользователя'),
      );
    }

    return Result.ok();
  }
}
