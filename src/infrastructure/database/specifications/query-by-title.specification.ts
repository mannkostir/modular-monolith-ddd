import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class QueryByTitleSpecification extends TypeormSpecification<{
  title?: string;
}> {
  execute() {
    if (this.query.title) {
      this.queryBuilder.andWhere(
        `${this.getAlias()}.title ILIKE('%'||:title||'%')`,
        {
          title: this.query.title,
        },
      );
    }
    return this.queryBuilder;
  }
}
