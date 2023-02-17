---
to: src/domains/<%= module %>/commands/<%= aggregate %>/<%= name %>/<%= name %>.response.dto.ts
---
<%RequestDtoName = h.changeCase.pascal(name) + 'ResponseDto' %>
export class <%= RequestDtoName %> {}