import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { GetUserQuery } from '@src/domains/identity/queries/user/get-user/get-user.query';
import { GetUserDao } from '@src/domains/identity/queries/user/get-user/get-user.dao';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { Result } from '@lib/utils/result.util';

@CqrsQueryHandler(GetUserQuery)
export class GetUserQueryHandler extends QueryHandler {
  async handle(query: GetUserQuery) {
    const getUserModel = new GetUserDao(this.dataSource).execute(
      query.params || {},
    );
    if (!getUserModel)
      return Result.fail(
        new EntityNotFoundDomainError('Пользователь не найден'),
      );

    return Result.ok(getUserModel);
  }
}
