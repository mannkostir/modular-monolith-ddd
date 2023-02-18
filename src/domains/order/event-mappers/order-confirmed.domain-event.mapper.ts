import { EventsHandler } from '@lib/base/communication/events-handler.decorator';
import { OrderConfirmedDomainEvent } from '@src/domains/order/domain/events/order-confirmed.domain-event';
import { DomainEventMapper } from '@lib/base/domain/domain-event-mapper';
import { Result } from '@lib/utils/result.util';
import { OrderConfirmedMessage } from '@src/domains/order/messages/order-confirmed.message';
import { Exception } from '@lib/base/common/exception';

@EventsHandler(OrderConfirmedDomainEvent)
export class PdfReportAttachedEventMapper extends DomainEventMapper {
  execute(
    event: OrderConfirmedDomainEvent,
  ): Result<OrderConfirmedMessage, Exception> {
    return Result.ok(new OrderConfirmedMessage(event));
  }
}
