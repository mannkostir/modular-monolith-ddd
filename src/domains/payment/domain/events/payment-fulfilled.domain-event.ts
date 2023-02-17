import { DomainEvent } from '@lib/base/domain/domain-event';

type Payload = {
  paymentId: string;
};

export class PaymentFulfilledDomainEvent extends DomainEvent<Payload> {
  token = 'payment_fulfilled';
}
