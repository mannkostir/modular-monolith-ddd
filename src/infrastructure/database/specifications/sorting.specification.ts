import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class SortingSpecification<
  SortField extends string = string,
> extends TypeormSpecification<{
  sort: SortField;
  order: 'ASC' | 'DESC';
}> {
  execute() {
    if (this.query.sort) {
      this.queryBuilder.orderBy(
        `${this.getAlias()}."${this.query.sort}"`,
        this.query.order || 'ASC',
      );
    }

    return this.queryBuilder;
  }
}
