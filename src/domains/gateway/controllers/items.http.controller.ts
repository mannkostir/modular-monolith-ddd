import { HttpController } from '@src/domains/gateway/base/http-controller';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoContentResponseDecorator } from '@src/domains/gateway/decorators/no-content-response.decorator';
import { OrderItemRequestDto } from '@lib/communication/gateway-interface/order/commands/order-item/order-item.request.dto';
import { UuidParam } from '@src/domains/gateway/decorators/uuid-param.decorator';
import { ActorId } from '@src/domains/gateway/decorators/actor-id.decorator';
import { GetOrderQuery } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.query';
import { Result } from '@lib/utils/result.util';
import { GetOrderResponseDto } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.response.dto';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { CreateOrderCommand } from '@lib/communication/gateway-interface/order/commands/create-order/create-order.command';
import { EntityId } from '@lib/communication/gateway-interface/api-types/entity-id.api-type';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { OrderItemCommand } from '@lib/communication/gateway-interface/order/commands/order-item/order-item.command';

@Controller('item')
@ApiTags('item')
export class ItemsHttpController extends HttpController {
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
        Result<EntityId, InvalidOperationDomainError>
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
