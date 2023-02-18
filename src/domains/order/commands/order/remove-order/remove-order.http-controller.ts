import { HttpController } from '@lib/base/common/http-controller';
import { Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RemoveOrderCommand } from '@src/domains/order/commands/order/remove-order/remove-order.command';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { DomainException } from '@lib/base/common/domain.exception';
import { Result } from '@lib/utils/result.util';

@Controller('order')
@ApiTags('order')
export class RemoveOrderHttpController extends HttpController {
  @NoContentResponseDecorator('Удалить заказ')
  @Delete('/:id')
  private async removeOrder(@UuidParam('id') orderId: string) {
    const result = await this.commandBus.execute<
      RemoveOrderCommand,
      Result<void, DomainException>
    >(new RemoveOrderCommand({ payload: { orderId } }));

    return result.unwrap();
  }
}
