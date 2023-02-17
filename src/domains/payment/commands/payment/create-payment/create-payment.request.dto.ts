import { IsNumberString } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsNumberString()
  amount!: number;
}
