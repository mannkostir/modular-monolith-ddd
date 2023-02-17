import { IsUUID } from 'class-validator';

export class CreateOrderRequestDto {
  @IsUUID()
  customerId!: string;
}
