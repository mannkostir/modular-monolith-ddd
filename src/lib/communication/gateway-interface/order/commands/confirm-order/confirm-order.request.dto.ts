import { IsUUID } from 'class-validator';

export class ConfirmOrderRequestDto {
  @IsUUID()
  orderId!: string;
}
