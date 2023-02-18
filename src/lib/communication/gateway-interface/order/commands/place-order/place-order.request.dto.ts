import { IsUUID } from 'class-validator';

export class PlaceOrderRequestDto {
  @IsUUID()
  orderId!: string;
}
