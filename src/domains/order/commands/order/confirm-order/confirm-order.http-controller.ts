import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Patch } from '@nestjs/common';
import { ConfirmOrderRequestDto } from '@src/domains/order/commands/order/confirm-order/confirm-order.request.dto';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { ConfirmOrderCommand } from '@src/domains/order/commands/order/confirm-order/confirm-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class ConfirmOrderHttpController extends HttpController {
  @NoContentResponseDecorator('Confirm order')
  @Patch('/:id/confirm')
  private async confirmOrder(
    @Body() body: ConfirmOrderRequestDto,
    @UuidParam('id') orderId: string,
  ) {
    const result = await this.commandBus.execute<
      ConfirmOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new ConfirmOrderCommand({ payload: { ...body, orderId } }));

    return result.unwrap();
  }
}
