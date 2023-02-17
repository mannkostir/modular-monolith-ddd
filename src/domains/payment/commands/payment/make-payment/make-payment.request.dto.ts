import { IsUUID } from 'class-validator';

export class MakePaymentRequestDto {
  @IsUUID()
  invoiceId!: string;
}
