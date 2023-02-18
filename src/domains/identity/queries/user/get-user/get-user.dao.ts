import { TypeormDao } from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { QueryByEmailSpecification } from '@src/infrastructure/database/specifications/query-by-email.specification';
import { User } from '@lib/communication/gateway-interface/api-types/user.api-type';

export type GetUserParams = {
  id?: string;
  email?: string;
};

export type GetUserModel = User;

export class GetUserDao extends TypeormDao<GetUserModel, GetUserParams> {
  protected prepareModel(
    params: GetUserParams,
  ): Promise<GetUserModel | undefined> {
    return this.getOne(params);
  }

  protected prepareQb(
    qb: ExtendedQueryBuilder<GetUserModel>,
    params: GetUserParams,
  ): ExtendedQueryBuilder<GetUserModel> {
    qb.select(['user.id', 'user.email'])
      .from('users', 'user')
      .addSpecification(new QueryByEmailSpecification(params));

    return qb;
  }
}
