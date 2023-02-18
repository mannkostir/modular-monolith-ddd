import { IsUUID } from 'class-validator';

export class GetOrderParamsDto {
  @IsUUID()
  orderId?: string;
}
