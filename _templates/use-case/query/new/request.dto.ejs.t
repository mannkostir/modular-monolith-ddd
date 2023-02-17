---
to: src/modules/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.request.dto.ts
---
<%RequestDtoName = h.changeCase.pascal(name) + 'RequestDto'%>
export class <%= RequestDtoName %> {}