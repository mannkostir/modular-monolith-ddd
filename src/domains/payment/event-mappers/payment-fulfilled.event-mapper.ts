import { DomainEventMapper } from '@lib/base/domain/domain-event-mapper';
import { EventsHandler } from '@lib/base/communication/events-handler.decorator';
import { PaymentFulfilledDomainEvent } from '@src/domains/payment/domain/events/payment-fulfilled.domain-event';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { PaymentFulfilledMessage } from '@src/domains/payment/messages/payment-fulfilled.message';
import { IPaymentFulfilledMessage } from '@lib/messages/payment-fulfilled.message.interface';

@EventsHandler(PaymentFulfilledDomainEvent)
export class PaymentFulfilledEventMapper extends DomainEventMapper {
  execute(
    event: PaymentFulfilledDomainEvent,
  ): Result<IPaymentFulfilledMessage, Exception> {
    return Result.ok(new PaymentFulfilledMessage(event));
  }
}
