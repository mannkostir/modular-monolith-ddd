---
to: src/modules/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.query.ts
---
<%QueryName = h.changeCase.pascal(name) + 'Query'
  RequestDtoName = h.changeCase.pascal(name) + 'RequestDto'
%>
import { QueryBase } from 'src/lib/domain/base/query.base';
import { <%= RequestDtoName %> } from './<%= name %>.request.dto';

export class <%=QueryName%> extends QueryBase<<%= RequestDtoName %>> {}
