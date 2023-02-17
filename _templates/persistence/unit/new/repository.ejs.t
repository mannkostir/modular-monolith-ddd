---
to: src/domains/<%= module %>/persistence/<%= aggregate %>/<%= name %>/<%= name %>.repository.ts
---
<%Entity = h.changeCase.pascal(name) + 'Repository'
  EntityProps = h.changeCase.pascal(name) + 'Props'
  EntityName = h.changeCase.pascal(name)
  OrmMapper = h.changeCase.pascal(name) + 'OrmMapper' %>
import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  <%= Entity %>,
  <%= EntityProps %>,
} from '@src/domains/<%= module %>/domain/entities/<%= EntityName %>.entity';
import { <%= EntityName %> } from '@src/infrastructure/database/types/<%= EntityName %>.type';
import { Repository } from 'typeorm';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { <%= OrmMapper %> } from './<%= EntityName %>.orm-mapper';

export class <%= EntityName %>Repository extends TypeormRepository<
  <%= Entity %>,
  <%= EntityProps %>,
  <%= EntityName %>
> {
  constructor(
    repository: Repository< <%= EntityName %> >,
    unitOfWOrk: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new <%= OrmMapper %>(), unitOfWOrk, correlationId);
  }
}
