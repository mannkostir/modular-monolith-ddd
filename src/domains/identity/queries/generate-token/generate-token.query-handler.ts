import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';
import { GenerateTokenQuery } from '@src/domains/identity/queries/generate-token/generate-token.query';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { JwtService } from '@nestjs/jwt';
import { QueryHandler } from '@lib/base/communication/query-handler';

@CqrsQueryHandler(GenerateTokenQuery)
export class GenerateTokenQueryHandler extends QueryHandler {
  async handle(
    query: GenerateTokenQuery,
  ): Promise<Result<string, InvalidOperationDomainError>> {
    const jwtService = this.moduleRef.get(JwtService);

    if (!query.params || !query.params.userId || !query.params.email)
      return Result.fail(
        new InvalidOperationDomainError('Некорректные данные'),
      );

    const token = await jwtService.signAsync({
      email: query.params.email,
      id: query.params.userId,
    });

    return Result.ok(token);
  }
}
