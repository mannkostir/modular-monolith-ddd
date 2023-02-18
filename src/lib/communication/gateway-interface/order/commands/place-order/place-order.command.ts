import { Command } from '@lib/base/communication/command';
import { PlaceOrderRequestDto } from './place-order.request.dto';

export class PlaceOrderCommand extends Command<
  PlaceOrderRequestDto & { orderId: string }
> {}
