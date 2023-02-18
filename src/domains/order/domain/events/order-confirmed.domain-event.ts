import { DomainEvent } from '@lib/base/domain/domain-event';

type Payload = {
  orderId: string;
  orderTotal: number;
};

export class OrderConfirmedDomainEvent extends DomainEvent<Payload> {
  token = 'order_confirmed';
}
