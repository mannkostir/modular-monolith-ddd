import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/identity/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { GenerateTokenCommand } from '@lib/communication/gateway-interface/user/commands/generate-token/generate-token.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { JwtService } from '@nestjs/jwt';

@CqrsCommandHandler(GenerateTokenCommand)
export class GenerateTokenCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: GenerateTokenCommand,
  ): Promise<Result<string, InvalidOperationDomainError>> {
    const jwtService = this.moduleRef.get(JwtService);

    const token = await jwtService.signAsync({
      email: command.payload.email,
      id: command.payload.userId,
    });

    return Result.ok(token);
  }
}
