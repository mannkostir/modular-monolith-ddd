---
to: src/domains/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.query.ts
---
<%QueryName = h.changeCase.pascal(name) + 'Query'
  RequestDtoName = h.changeCase.pascal(name) + 'RequestDto'
%>
import { Query } from '@lib/base/communication/query';
import { <%= RequestDtoName %> } from './<%= name %>.request.dto';

export class <%=QueryName%> extends Query<<%= RequestDtoName %>> {}
