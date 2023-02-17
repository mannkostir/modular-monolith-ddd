import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class QueryInIdsSpecification extends TypeormSpecification<{
  ids: string[];
}> {
  execute() {
    if (this.query.ids?.length) {
      this.queryBuilder
        .andWhere(`${this.getAlias()}.id = ANY(:${this.getParamName('ids')})`)
        .setParameter(this.getParamName('ids'), this.query.ids);
    }
    return this.queryBuilder;
  }
}
