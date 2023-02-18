import { Message } from '@lib/base/communication/message';
import {
  IPaymentFulfilledMessage,
  PaymentFulfilledMessagePayload,
} from '@lib/messages/payment-fulfilled.message.interface';
import { PaymentFulfilledDomainEvent } from '@src/domains/payment/domain/events/payment-fulfilled.domain-event';

export class PaymentFulfilledMessage
  extends Message<PaymentFulfilledMessagePayload>
  implements IPaymentFulfilledMessage
{
  constructor(domainEvent: PaymentFulfilledDomainEvent) {
    super(
      domainEvent,
      { paymentId: domainEvent.payload.paymentId },
      'payment_fulfilled',
      'payment',
    );
  }
}
