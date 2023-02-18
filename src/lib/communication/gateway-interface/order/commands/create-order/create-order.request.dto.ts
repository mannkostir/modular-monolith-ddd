import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderRequestDto {
  @IsUUID()
  @ApiProperty()
  customerId!: string;
}
