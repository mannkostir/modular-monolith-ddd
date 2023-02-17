import { IsNumberString, IsUUID } from 'class-validator';

export class OrderItemRequestDto {
  @IsUUID()
  itemId!: string;
  @IsUUID()
  orderId!: string;
  @IsNumberString()
  quantity!: number;
}
