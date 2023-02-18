import { DomainEvent } from '@lib/base/domain/domain-event';

type Payload = {
  orderId: string;
};

export class OrderCancelledDomainEvent extends DomainEvent<Payload> {
  token = 'order_cancelled';
}
