---
to: src/domains/<%= module %>/persistence/<%= aggregate %>/<%= name %>/<%= name %>.orm-mapper.ts
---
<%Entity = h.changeCase.pascal(name) + 'Repository'
  EntityProps = h.changeCase.pascal(name) + 'Props'
  EntityName = h.changeCase.pascal(name)
  OrmMapper = h.changeCase.pascal(name) + 'OrmMapper' %>
import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  <%= Entity %>,
  <%= EntityProps %>,
} from '@src/domains/<%= module %>/domain/entities/<%= EntityName %>.entity';
import { <%= EntityName %> } from '@src/infrastructure/database/types/<%= EntityName %>.type';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';

export class <%= EntityName %>OrmMapper extends OrmMapper< <%= Entity %>, <%= EntityProps %>, <%= EntityName %>> {
  protected getEntityConstructor(ormEntity: <%= EntityName %>): {
    new (props: any): <%= Entity %>;
  } {
    return <%= Entity %>;
  }

  protected async toDomainProps(ormEntity: <%= EntityName %>): Promise< <%= EntityProps %> > {
    return { name: ormEntity.name, price: ormEntity.price };
  }

  protected async toOrmProps(
    entity: <%= Entity %>,
  ): Promise<OrmEntityProps< <%= EntityName %> >> {
    const props = entity.getCopiedProps();

    return { name: props.name, price: props.price };
  }
}
