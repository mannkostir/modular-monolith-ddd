---
to: src/domains/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.query-handler.ts
---
<%
QueryName = h.changeCase.pascal(name) + 'Query'
HandlerName = h.changeCase.pascal(name) + 'QueryHandler'
%>
import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { <%= QueryName %> } from './<%=name%>.query';

@CqrsQueryHandler(<%= QueryName %>)
export class <%= HandlerName %> extends QueryHandler {

  async handle(query: <%=QueryName%>) {}
}
