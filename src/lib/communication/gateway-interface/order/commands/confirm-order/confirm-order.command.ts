import { Command } from '@lib/base/communication/command';
import { ConfirmOrderRequestDto } from './confirm-order.request.dto';

export class ConfirmOrderCommand extends Command<
  ConfirmOrderRequestDto & { orderId: string }
> {}
