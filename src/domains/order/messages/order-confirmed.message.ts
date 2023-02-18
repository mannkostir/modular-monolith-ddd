import { Message } from '@lib/base/communication/message';
import {
  IOrderConfirmedMessage,
  OrderConfirmedPayload,
} from '@lib/messages/order-confirmed.message.interface';
import { OrderConfirmedDomainEvent } from '@src/domains/order/domain/events/order-confirmed.domain-event';

export class OrderConfirmedMessage
  extends Message<OrderConfirmedPayload>
  implements IOrderConfirmedMessage
{
  constructor(domainEvent: OrderConfirmedDomainEvent) {
    super(
      domainEvent,
      {
        total: domainEvent.payload.orderTotal,
        orderId: domainEvent.payload.orderId,
      },
      'order_confirmed',
      'order',
    );
  }
}
