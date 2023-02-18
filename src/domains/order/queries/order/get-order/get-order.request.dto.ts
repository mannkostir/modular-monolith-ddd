import { IsOptional, IsUUID } from 'class-validator';

export class GetOrderRequestDto {
  @IsUUID()
  @IsOptional()
  invoiceId?: string;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  orderId?: string;
}
