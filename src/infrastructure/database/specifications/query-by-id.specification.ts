import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export class QueryByIdSpecification extends TypeormSpecification<{
  id: UuidVO;
}> {
  execute() {
    if (this.query.id?.value) {
      this.queryBuilder.andWhere(`${this.getAlias()}.id = :id`, {
        id: this.query.id.value,
      });
    }
    return this.queryBuilder;
  }
}
