import { Command } from '@lib/base/communication/command';
import { RemoveOrderRequestDto } from './remove-order.request.dto';

export class RemoveOrderCommand extends Command<
  RemoveOrderRequestDto & { orderId: string }
> {}
