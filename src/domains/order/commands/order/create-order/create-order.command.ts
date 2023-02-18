import { Command } from '@lib/base/communication/command';
import { CreateOrderRequestDto } from './create-order.request.dto';

export class CreateOrderCommand extends Command<CreateOrderRequestDto> {}
