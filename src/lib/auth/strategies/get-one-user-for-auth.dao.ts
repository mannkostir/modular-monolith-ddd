import {
  DaoParams,
  TypeormDao,
} from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { QueryByEmailSpecification } from '@src/infrastructure/database/specifications/query-by-email.specification';
import { UserForAuth } from '@lib/auth/interfaces/user-for-auth.type';

export interface GetOneUserForAuthParams extends DaoParams {
  email?: string;
}

export type GetOneUserForAuthModel = UserForAuth;

export class GetOneUserForAuthDao extends TypeormDao<
  GetOneUserForAuthModel,
  GetOneUserForAuthParams
> {
  protected prepareModel(
    params: GetOneUserForAuthParams,
  ): Promise<GetOneUserForAuthModel | undefined> {
    return this.getOne(params);
  }

  protected prepareQb(
    qb: ExtendedQueryBuilder<GetOneUserForAuthModel>,
    params: GetOneUserForAuthParams,
  ): ExtendedQueryBuilder<any> {
    return qb
      .select(['u.id as id', 'u.email as email', 'u.password as password'])
      .from('user', 'u')
      .addSpecification(new QueryByEmailSpecification(params));
  }
}
