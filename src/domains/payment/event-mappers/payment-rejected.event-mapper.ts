import { DomainEventMapper } from '@lib/base/domain/domain-event-mapper';
import { EventsHandler } from '@lib/base/communication/events-handler.decorator';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';
import { PaymentRejectedDomainEvent } from '@src/domains/payment/domain/events/payment-rejected.domain-event';
import { IPaymentRejectedMessage } from '@lib/messages/payment-rejected.message.interface';
import { PaymentRejectedMessage } from '@src/domains/payment/messages/payment-rejected.message';

@EventsHandler(PaymentRejectedDomainEvent)
export class PaymentRejectedEventMapper extends DomainEventMapper {
  execute(
    event: PaymentRejectedDomainEvent,
  ): Result<IPaymentRejectedMessage, Exception> {
    return Result.ok(new PaymentRejectedMessage(event));
  }
}
