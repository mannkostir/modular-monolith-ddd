---
to: src/domains/<%= module %>/commands/<%= aggregate %>/<%= name %>/<%= name %>.command-handler.ts
---
<%HandlerName = h.changeCase.pascal(name) + 'CommandHandler'
  CommandName = h.changeCase.pascal(name) + 'Command' %>
import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/<%= module %>/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { <%= CommandName %> } from './<%= name %>.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';

@CqrsCommandHandler(<%= CommandName %>)
export class <%= HandlerName %> extends CommandHandler<UnitOfWork> {
  async handle(command: <%= CommandName %>): Promise<Result<void, InvalidOperationDomainError>> {}
}
