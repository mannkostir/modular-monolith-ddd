import { DomainEvent } from '@lib/base/domain/domain-event';

type Payload = {
  paymentId: string;
};

export class PaymentRejectedDomainEvent extends DomainEvent<Payload> {
  token = 'payment_rejected';
}
