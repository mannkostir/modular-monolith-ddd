import { AsyncDomainEventHandler } from '@lib/base/domain/async-domain-event-handler';
import { AsyncEventsHandler } from '@lib/base/communication/async-events-handler.decorator';
import { OrderCancelledDomainEvent } from '@src/domains/order/domain/events/order-cancelled.domain-event';
import { Result } from '@lib/utils/result.util';
import { DomainException } from '@lib/base/common/domain.exception';
import { RemoveOrderCommand } from '@src/domains/order/commands/order/remove-order/remove-order.command';

@AsyncEventsHandler(OrderCancelledDomainEvent)
export class RemoveOrderEventHandler extends AsyncDomainEventHandler {
  execute(
    event: OrderCancelledDomainEvent,
  ): Promise<Result<void, DomainException>> {
    return this.commandBus.execute<
      RemoveOrderCommand,
      Result<void, DomainException>
    >(new RemoveOrderCommand({ payload: { orderId: event.payload.orderId } }));
  }
}
