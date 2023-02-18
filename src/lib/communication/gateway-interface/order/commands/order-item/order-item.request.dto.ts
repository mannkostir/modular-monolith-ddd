import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemRequestDto {
  @IsNumberString()
  @ApiProperty()
  quantity!: number;
}
