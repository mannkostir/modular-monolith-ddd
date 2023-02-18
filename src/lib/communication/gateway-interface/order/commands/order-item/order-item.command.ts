import { Command } from '@lib/base/communication/command';
import { OrderItemRequestDto } from './order-item.request.dto';

export class OrderItemCommand extends Command<
  OrderItemRequestDto & { itemId: string; orderId: string }
> {}
