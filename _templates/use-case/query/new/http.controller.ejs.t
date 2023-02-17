---
to: src/modules/<%= module %>/queries/<%= aggregate %>/<%= name %>/<%= name %>.http.controller.ts
---
<%ControllerName = h.changeCase.pascal(name) + 'HttpController'
%>
import { Controller, Get } from '@nestjs/common';
import { routesV1 } from 'src/infrastructure/configs/app.routes';
import { Controller as HttpController } from '@src/lib/domain/base/controller.base';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('<%= module %>/<%= aggregate %>')
@Controller(routesV1.version)
export class <%= ControllerName %> extends HttpController {
  @ApiBearerAuth()
  @ApiOperation({ summary:  })
  @ApiOkResponse({ type:  })
  @Get(routesV1.)
  async handle() {}
}
