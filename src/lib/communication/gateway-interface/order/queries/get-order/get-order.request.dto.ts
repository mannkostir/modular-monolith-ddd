import { IsUUID } from 'class-validator';

export class GetOrderRequestDto {
  @IsUUID()
  invoiceId?: string;

  @IsUUID()
  customerId?: string;
}
