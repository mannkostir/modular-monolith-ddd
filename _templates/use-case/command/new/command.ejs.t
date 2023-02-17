---
to: src/domains/<%= module %>/commands/<%= aggregate %>/<%= name %>/<%= name %>.command.ts
---
<%CommandName = h.changeCase.pascal(name) + 'Command'
  RequestDtoName = h.changeCase.pascal(name) + 'RequestDto' %>
import { Command } from '@lib/base/communication/command';
import { <%= RequestDtoName %> } from './<%= name %>.request.dto';

export class <%= CommandName %> extends Command<<%= RequestDtoName %>> {}
