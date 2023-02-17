import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';
import { PaginatedResponse } from '@lib/base/common/paginated.response';
import { QueryByIdSpecification } from '@src/infrastructure/database/specifications/query-by-id.specification';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export type DaoParams = {
  id?: string;
};

export abstract class TypeormDao<
  Model extends Record<string, any>,
  Params extends DaoParams = DaoParams,
> {
  private readonly queryBuilder: ExtendedQueryBuilder<any>;

  constructor(private dataSource: DataSource) {
    this.queryBuilder = new ExtendedQueryBuilder(
      this.dataSource.createQueryBuilder(),
    );
  }

  public async execute(params: Params): Promise<Model | undefined> {
    return this.prepareModel(params);
  }

  protected abstract prepareQb(
    qb: ExtendedQueryBuilder<Model>,
    params: Params,
  ): ExtendedQueryBuilder<Model>;

  protected abstract prepareModel(params: Params): Promise<Model | undefined>;

  protected async getOne<OneModel = Model>(
    params: Params,
  ): Promise<OneModel | undefined> {
    return this.getBaseQb(params).getRawOne();
  }

  protected async getMany(params: Params): Promise<Model[]> {
    return this.getBaseQb(params).getRawMany();
  }

  protected async getManyPaginated<PaginatedModel = Model>(
    params: Params & PaginationQuery,
  ): Promise<PaginatedResponse<PaginatedModel>> {
    return this.paginate<PaginatedModel>(params, this.getBaseQb(params));
  }

  protected async getCount(params: Params): Promise<number> {
    return this.getBaseQb(params).getCount();
  }

  private getBaseQb(params: Params): ExtendedQueryBuilder<any> {
    return this.prepareQb(this.queryBuilder, params).addSpecification(
      new QueryByIdSpecification({
        id: params.id ? new UuidVO(params.id) : undefined,
      }),
    );
  }

  private async paginate<PaginatedModel = Model>(
    params: PaginationQuery,
    qb: SelectQueryBuilder<ObjectLiteral>,
  ): Promise<PaginatedResponse<PaginatedModel>> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit);

    page && qb.offset((page - 1) * limit);
    limit && qb.limit(limit);

    const data = await qb.getRawMany();
    const total = await qb.getCount();

    const count = data.length;
    const pageCount = limit ? Math.ceil(total / limit) : 1;

    return new PaginatedResponse<PaginatedModel>(data, {
      count,
      total,
      page,
      pageCount,
    });
  }
}
