import { EntityTarget, SelectQueryBuilder } from 'typeorm';
import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

type SubQueryFactory = (qb: SelectQueryBuilder<any>) => SelectQueryBuilder<any>;

export class ExtendedQueryBuilder<
  OrmEntity extends Record<string, any> = Record<
    string | symbol | number,
    unknown
  >,
> extends SelectQueryBuilder<OrmEntity> {
  addSpecification(
    specification: TypeormSpecification,
  ): ExtendedQueryBuilder<OrmEntity> {
    specification.acceptQueryBuilder(this);
    specification.execute();
    return this;
  }

  from<T extends Record<string, any>>(
    entityTarget: EntityTarget<T> | SubQueryFactory,
    aliasName: string,
  ): ExtendedQueryBuilder<T> {
    return super.from(entityTarget, aliasName) as ExtendedQueryBuilder<T>;
  }
}
