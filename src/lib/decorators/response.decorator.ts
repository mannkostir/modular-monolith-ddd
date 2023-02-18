import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpCode, Type } from '@nestjs/common';
import { applyMethodDecorators } from '@lib/utils/apply-decorators.util';

export function ResponseDecorator<Response>(
  responseType: Type<Response>,
  description: string,
) {
  return applyMethodDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: description }),
    HttpCode(200),
    ApiOkResponse({ type: responseType }),
  );
}
