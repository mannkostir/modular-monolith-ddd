import { Message } from '@lib/base/communication/message';
import {
  IPaymentRejectedMessage,
  PaymentRejectedMessagePayload,
} from '@lib/messages/payment-rejected.message.interface';
import { PaymentRejectedDomainEvent } from '@src/domains/payment/domain/events/payment-rejected.domain-event';

export class PaymentRejectedMessage
  extends Message<PaymentRejectedMessagePayload>
  implements IPaymentRejectedMessage
{
  constructor(domainEvent: PaymentRejectedDomainEvent) {
    super(
      domainEvent,
      { paymentId: domainEvent.payload.paymentId },
      'payment_rejected',
      'payment',
    );
  }
}
