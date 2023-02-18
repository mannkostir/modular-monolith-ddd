import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';
import { applyMethodDecorators } from '@lib/utils/apply-decorators.util';

export function CreatedResponseDecorator(description: string) {
  return applyMethodDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: description }),
    HttpCode(201),
  );
}
