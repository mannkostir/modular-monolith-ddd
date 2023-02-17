import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class NaturalSortingSpecification<
  SortField extends string = string,
> extends TypeormSpecification<{
  sort: SortField;
  alias?: string;
  order: 'ASC' | 'DESC';
}> {
  execute() {
    if (this.query.sort) {
      this.queryBuilder.orderBy(
        `${this.query.alias || this.getAlias()}."${
          this.query.sort
        }" COLLATE natural_sorting`,
        this.query.order || 'ASC',
      );
    }

    return this.queryBuilder;
  }
}
