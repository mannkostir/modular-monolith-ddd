import { HttpController } from '@src/domains/gateway/base/http-controller';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelOrderCommand } from '@lib/communication/gateway-interface/order/commands/cancel-order/cancel-order.command';
import { CancelOrderRequestDto } from '@lib/communication/gateway-interface/order/commands/cancel-order/cancel-order.request.dto';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ConfirmOrderRequestDto } from '@lib/communication/gateway-interface/order/commands/confirm-order/confirm-order.request.dto';
import { CreateOrderRequestDto } from '@lib/communication/gateway-interface/order/commands/create-order/create-order.request.dto';
import { PlaceOrderRequestDto } from '@lib/communication/gateway-interface/order/commands/place-order/place-order.request.dto';
import { ConfirmOrderCommand } from '@lib/communication/gateway-interface/order/commands/confirm-order/confirm-order.command';
import { CreateOrderCommand } from '@lib/communication/gateway-interface/order/commands/create-order/create-order.command';
import { PlaceOrderCommand } from '@lib/communication/gateway-interface/order/commands/place-order/place-order.command';
import { GetOrderRequestDto } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.request.dto';
import { GetOrderQuery } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.query';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { UuidParam } from '@src/domains/gateway/decorators/uuid-param.decorator';
import { GetOrderResponseDto } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.response.dto';
import { NoContentResponseDecorator } from '@src/domains/gateway/decorators/no-content-response.decorator';
import { ResponseDecorator } from '@src/domains/gateway/decorators/response.decorator';
import { CreatedResponseDecorator } from '@src/domains/gateway/decorators/created-response.decorator';

@Controller('order')
@ApiTags('order')
export class OrderHttpController extends HttpController {
  @NoContentResponseDecorator('Cancel order')
  @Patch('/:id/cancel')
  private async cancelOrder(
    @Body() body: CancelOrderRequestDto,
    @UuidParam('id') orderId: string,
  ) {
    const result = await this.commandBus.execute<
      CancelOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new CancelOrderCommand({ payload: { ...body, orderId } }));

    return result.unwrap();
  }

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

  @CreatedResponseDecorator('Create order')
  @Post()
  private async createOrder(@Body() body: CreateOrderRequestDto) {
    const result = await this.commandBus.execute<
      CreateOrderCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateOrderCommand({ payload: body }));

    return result.unwrap();
  }

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

  @ResponseDecorator(GetOrderResponseDto, 'Get order')
  @Get(':/id')
  private async getOrder(
    @UuidParam('id') id: string,
    @Query() query: GetOrderRequestDto,
  ) {
    const result = await this.queryBus.execute<
      GetOrderQuery,
      Result<GetOrderResponseDto, EntityNotFoundDomainError>
    >(
      new GetOrderQuery({
        params: { invoiceId: query.invoiceId, orderId: id },
      }),
    );

    return result.unwrap();
  }
}
