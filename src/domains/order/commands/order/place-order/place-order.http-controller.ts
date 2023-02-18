import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Patch } from '@nestjs/common';
import { PlaceOrderRequestDto } from '@src/domains/order/commands/order/place-order/place-order.request.dto';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { PlaceOrderCommand } from '@src/domains/order/commands/order/place-order/place-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class PlaceOrderHttpController extends HttpController {
  @NoContentResponseDecorator('Place order')
  @Patch('/:id/place')
  private async placeOrder(
    @Body() body: PlaceOrderRequestDto,
    @UuidParam('id') orderId: string,
  ) {
    const result = await this.commandBus.execute<
      PlaceOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new PlaceOrderCommand({ payload: { ...body, orderId } }));

    return result.unwrap();
  }
}
