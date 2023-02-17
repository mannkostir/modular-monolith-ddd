import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

export class QueryByEmailSpecification extends TypeormSpecification<{
  email: string;
}> {
  execute() {
    if (this.query.email) {
      this.queryBuilder.andWhere(`${this.getAlias()}.email ILIKE(:email)`, {
        email: this.query.email,
      });
    }
    return this.queryBuilder;
  }
}
