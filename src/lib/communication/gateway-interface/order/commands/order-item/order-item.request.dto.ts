import { IsNumberString } from 'class-validator';

export class OrderItemRequestDto {
  @IsNumberString()
  quantity!: number;
}
