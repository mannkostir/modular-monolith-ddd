import { Order } from '@lib/communication/gateway-interface/order/queries/get-order/order.api-type';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from '@lib/communication/gateway-interface/order/queries/get-order/order-status.api-type';

export class GetOrderResponseDto implements Order {
  @IsUUID()
  id!: string;
  @IsUUID()
  invoiceId!: string;
  @IsEnum(OrderStatus)
  status!: OrderStatus;
  @IsUUID()
  customerId!: string;
}
