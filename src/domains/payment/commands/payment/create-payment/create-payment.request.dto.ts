import { IsNumberString, IsUUID } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsNumberString()
  amount!: number;

  @IsUUID()
  paymentId?: string;
}
