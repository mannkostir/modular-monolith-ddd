
import { Command } from '@lib/base/communication/command';
import { MakePaymentRequestDto } from './make-payment.request.dto';

export class MakePaymentCommand extends Command<MakePaymentRequestDto> {}
