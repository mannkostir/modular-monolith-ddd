import { HttpController } from '@lib/base/common/http-controller';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { OrderItemRequestDto } from '@src/domains/order/commands/ordered-item/order-item/order-item.request.dto';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { ActorId } from '@lib/decorators/actor-id.decorator';
import { GetOrderQuery } from '@src/domains/order/queries/order/get-order/get-order.query';
import { Result } from '@lib/utils/result.util';
import { GetOrderResponseDto } from '@src/domains/order/queries/order/get-order/get-order.response.dto';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { CreateOrderCommand } from '@src/domains/order/commands/order/create-order/create-order.command';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { OrderItemCommand } from '@src/domains/order/commands/ordered-item/order-item/order-item.command';

@Controller('item')
@ApiTags('item')
export class OrderItemHttpController extends HttpController {
  @NoContentResponseDecorator('Order item')
  @Post('/:itemId/order')
  private async order(
    @Body() body: OrderItemRequestDto,
    @UuidParam('itemId') itemId: string,
    @ActorId() userId: string,
  ) {
    const getOrderResult = await this.queryBus.execute<
      GetOrderQuery,
      Result<GetOrderResponseDto, EntityNotFoundDomainError>
    >(
      new GetOrderQuery({
        params: { customerId: userId },
      }),
    );

    let orderId: string | undefined;

    if (getOrderResult.isErr) {
      const createOrderResult = await this.commandBus.execute<
        CreateOrderCommand,
        Result<{ id: string }, InvalidOperationDomainError>
      >(new CreateOrderCommand({ payload: { customerId: userId } }));
      if (createOrderResult.isErr) return createOrderResult;

      orderId = createOrderResult.unwrap().id;
    } else {
      orderId = getOrderResult.unwrap().id;
    }

    const result = await this.commandBus.execute<
      OrderItemCommand,
      Result<void, InvalidOperationDomainError>
    >(new OrderItemCommand({ payload: { ...body, itemId, orderId } }));

    return result.unwrap();
  }
}
