import { IsUUID } from 'class-validator';

export class GetOrderRequestDto {
  @IsUUID()
  id?: string;
  @IsUUID()
  invoiceId?: string;
}
