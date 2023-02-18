import { Command } from '@lib/base/communication/command';
import { CancelOrderRequestDto } from './cancel-order.request.dto';

export class CancelOrderCommand extends Command<
  CancelOrderRequestDto & { orderId: string }
> {}
