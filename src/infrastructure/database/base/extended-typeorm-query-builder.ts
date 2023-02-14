import { EntityTarget, SelectQueryBuilder } from 'typeorm';
import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

type SubQueryFactory = (qb: SelectQueryBuilder<any>) => SelectQueryBuilder<any>;

export class ExtendedQueryBuilder<
  OrmEntity extends Record<string, unknown> = Record<
    string | symbol | number,
    unknown
  >,
> extends SelectQueryBuilder<OrmEntity> {
  addSpecification(
    specification: TypeormSpecification<Record<string, unknown>>,
  ): ExtendedQueryBuilder<OrmEntity> {
    specification.acceptQueryBuilder(this);
    specification.execute();
    return this;
  }

  from<T extends Record<string, unknown>>(
    entityTarget: EntityTarget<T> | SubQueryFactory,
    aliasName: string,
  ): ExtendedQueryBuilder<T> {
    return super.from(entityTarget, aliasName) as ExtendedQueryBuilder<T>;
  }
}
