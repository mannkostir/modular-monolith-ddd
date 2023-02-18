import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from '@src/domains/order/domain/types/order-status.type';

export class GetOrderResponseDto {
  @IsUUID()
  id!: string;
  @IsUUID()
  invoiceId!: string;
  @IsEnum(OrderStatus)
  status!: OrderStatus;
  @IsUUID()
  customerId!: string;
}
