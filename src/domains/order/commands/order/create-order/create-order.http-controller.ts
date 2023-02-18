import { HttpController } from '@lib/base/common/http-controller';
import { CreatedResponseDecorator } from '@lib/decorators/created-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderRequestDto } from '@src/domains/order/commands/order/create-order/create-order.request.dto';
import { CreateOrderCommand } from '@src/domains/order/commands/order/create-order/create-order.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class CreateOrderHttpController extends HttpController {
  @CreatedResponseDecorator('Create order')
  @Post()
  private async createOrder(@Body() body: CreateOrderRequestDto) {
    const result = await this.commandBus.execute<
      CreateOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateOrderCommand({ payload: body }));

    return result.unwrap();
  }
}
