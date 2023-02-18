import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Patch } from '@nestjs/common';
import { CancelOrderRequestDto } from '@src/domains/order/commands/order/cancel-order/cancel-order.request.dto';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { CancelOrderCommand } from '@src/domains/order/commands/order/cancel-order/cancel-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class CancelOrderHttpController extends HttpController {
  @NoContentResponseDecorator('Cancel order')
  @Patch('/:id/cancel')
  private async cancelOrder(
    @Body() body: CancelOrderRequestDto,
    @UuidParam('id') orderId: string,
  ) {
    const cancelResult = await this.commandBus.execute<
      CancelOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new CancelOrderCommand({ payload: { ...body, orderId } }));

    return cancelResult.unwrap();
  }
}
