import { Query } from '@lib/base/communication/query';
import { GetOrderRequestDto } from './get-order.request.dto';
import { GetOrderParamsDto } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.params.dto';

export class GetOrderQuery extends Query<
  GetOrderRequestDto & GetOrderParamsDto
> {}
