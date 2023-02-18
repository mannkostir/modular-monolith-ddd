import { TypeormDao } from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { QueryByEmailSpecification } from '@src/infrastructure/database/specifications/query-by-email.specification';

export type GetUserParams = {
  id?: string;
  email?: string;
};

export type GetUserModel = {
  id: string;
  email: string;
};

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
    qb.select(['u.id as id', 'u.email as email'])
      .from('user', 'u')
      .addSpecification(new QueryByEmailSpecification(params));

    return qb;
  }
}
