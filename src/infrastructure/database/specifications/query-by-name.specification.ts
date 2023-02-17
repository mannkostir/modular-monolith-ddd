import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class QueryByNameSpecification extends TypeormSpecification<{
  name?: string;
}> {
  execute() {
    if (this.query.name) {
      this.queryBuilder.andWhere(
        `${this.getAlias()}.name ILIKE('%'||:name||'%')`,
        {
          name: this.query.name,
        },
      );
    }
    return this.queryBuilder;
  }
}
