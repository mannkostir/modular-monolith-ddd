import { IsUUID } from 'class-validator';

export class CancelOrderRequestDto {
  @IsUUID()
  orderId!: string;
}
