import { Command } from '@lib/base/communication/command';
import { CreatePaymentRequestDto } from './create-payment.request.dto';

export class CreatePaymentCommand extends Command<CreatePaymentRequestDto> {}
