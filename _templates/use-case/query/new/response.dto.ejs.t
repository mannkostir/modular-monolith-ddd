---
to: src/modules/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.response.dto.ts
---
<%RequestDtoName = h.changeCase.pascal(name) + 'ResponseDto'%>
export class <%= RequestDtoName %> {}