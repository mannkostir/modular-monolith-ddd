import { HttpController } from '@lib/base/common/http-controller';
import { ResponseDecorator } from '@lib/decorators/response.decorator';
import { GetOrderResponseDto } from '@src/domains/order/queries/order/get-order/get-order.response.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { GetOrderRequestDto } from '@src/domains/order/queries/order/get-order/get-order.request.dto';
import { GetOrderQuery } from '@src/domains/order/queries/order/get-order/get-order.query';
import { Result } from '@lib/utils/result.util';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class GetOrderHttpController extends HttpController {
  @ResponseDecorator(GetOrderResponseDto, 'Get order')
  @Get('')
  private async getOrder(@Query() query: GetOrderRequestDto) {
    const result = await this.queryBus.execute<
      GetOrderQuery,
      Result<GetOrderResponseDto, EntityNotFoundDomainError>
    >(
      new GetOrderQuery({
        params: {
          invoiceId: query.invoiceId,
          orderId: query.orderId,
          customerId: query.customerId,
        },
      }),
    );

    return result.unwrap();
  }
}
