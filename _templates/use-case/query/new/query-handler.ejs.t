---
to: src/modules/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.query-handler.ts
---
<%
QueryName = h.changeCase.pascal(name) + 'Query'
HandlerName = h.changeCase.pascal(name) + 'QueryHandler'
%>
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from 'src/lib/domain/base/query.base';
import { <%= QueryName %> } from './<%=name%>.query';
import { ReadModel } from '@src/modules/<%= module %>/database/read-model/read.model';

@QueryHandler(<%= QueryName %>)
export class <%= HandlerName %> extends QueryHandlerBase {
  constructor(private readonly readModel: ReadModel) {
    super();
  }

  async handle(query: <%=QueryName%>) {}
}
