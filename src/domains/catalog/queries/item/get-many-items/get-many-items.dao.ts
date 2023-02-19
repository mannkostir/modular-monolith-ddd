import { PaginatedResponse } from '@lib/base/common/paginated.response';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';
import {
  DaoParams,
  TypeormDao,
} from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { QueryByNameSpecification } from '@src/infrastructure/database/specifications/query-by-name.specification';

export interface GetManyItemsParams extends DaoParams, PaginationQuery {
  name?: string;
}

export type GetManyItemsModel = {
  name: string;

  price: number;

  id: string;
};

export type GetManyItemsPaginatedModel = PaginatedResponse<GetManyItemsModel>;

export class GetManyItemsDao extends TypeormDao<
  GetManyItemsPaginatedModel,
  GetManyItemsParams
> {
  protected prepareModel(
    params: GetManyItemsParams,
  ): Promise<GetManyItemsPaginatedModel> {
    return this.getManyPaginated(params);
  }

  protected prepareQb(
    qb: ExtendedQueryBuilder<GetManyItemsPaginatedModel>,
    params: GetManyItemsParams,
  ): ExtendedQueryBuilder<GetManyItemsPaginatedModel> {
    qb.select(['item.name as name', 'item.id as id', 'item.price as price'])
      .from('item', 'item')
      .addSpecification(new QueryByNameSpecification(params));

    return qb;
  }
}
