import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemRequestDto {
  @IsInt()
  @IsPositive()
  @ApiProperty()
  quantity!: number;
}
