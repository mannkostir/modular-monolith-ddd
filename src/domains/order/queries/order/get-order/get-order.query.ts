import { Query } from '@lib/base/communication/query';
import { GetOrderRequestDto } from './get-order.request.dto';
import { GetOrderParamsDto } from '@src/domains/order/queries/order/get-order/get-order.params.dto';

export class GetOrderQuery extends Query<
  GetOrderRequestDto & GetOrderParamsDto
> {}
