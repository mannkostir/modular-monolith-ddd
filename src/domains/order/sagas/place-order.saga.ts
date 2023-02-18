import { Saga, SagaState } from '@src/domains/integration/base/saga';
import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { IOrderConfirmedMessage } from '@lib/messages/order-confirmed.message.interface';
import { RequestPaymentMessage } from '@src/domains/order/messages/request-payment.message';
import { IPaymentFulfilledMessage } from '@lib/messages/payment-fulfilled.message.interface';
import { GetOrderQuery } from '@src/domains/order/queries/order/get-order/get-order.query';
import { GetOrderModel } from '@src/domains/order/queries/order/get-order/get-order.dao';
import { PlaceOrderCommand } from '@src/domains/order/commands/order/place-order/place-order.command';
import { IPaymentRejectedMessage } from '@lib/messages/payment-rejected.message.interface';
import { CancelOrderCommand } from '@src/domains/order/commands/order/cancel-order/cancel-order.command';
import { Result } from '@lib/utils/result.util';
import { DomainException } from '@lib/base/common/domain.exception';

type SagaData = SagaState;

export class PlaceOrderSaga
  extends Saga<SagaData>
  implements
    IHandleMessage<IOrderConfirmedMessage>,
    IHandleMessage<IPaymentFulfilledMessage>,
    IHandleMessage<IPaymentRejectedMessage>
{
  execute(message: IOrderConfirmedMessage): Promise<void>;
  execute(message: IPaymentFulfilledMessage): Promise<void>;
  execute(message: IPaymentRejectedMessage): Promise<void>;
  async execute(
    message: IOrderConfirmedMessage | IPaymentFulfilledMessage,
  ): Promise<void> {
    if (message.token === 'order_confirmed') {
      return this.handleOrderConfirmed(message as IOrderConfirmedMessage);
    }
    if (message.token === 'payment_fulfilled') {
      return this.handlePaymentFulfilled(message as IPaymentFulfilledMessage);
    }
    if (message.token === 'payment_rejected') {
      return this.handlePaymentRejected(message as IPaymentRejectedMessage);
    }
  }

  protected getDefaultState(): SagaData {
    return { isCompleted: false, startWithMessage: 'order_confirmed' };
  }

  protected listenToMessages(): string[] {
    return ['order_confirmed', 'payment_fulfilled', 'payment_rejected'];
  }

  private async handleOrderConfirmed(
    message: IOrderConfirmedMessage,
  ): Promise<void> {
    await this.sendMessage(
      new RequestPaymentMessage(message, {
        amount: message.payload.total,
        invoiceId: message.payload.orderId,
      }),
    );
  }

  private async handlePaymentFulfilled(
    message: IPaymentFulfilledMessage,
  ): Promise<void> {
    const order = await this.sendLocalQuery<
      Result<GetOrderModel, DomainException>
    >(new GetOrderQuery({ params: { orderId: message.payload.paymentId } }));

    if (order.isErr) {
      console.error(order.safeUnwrap());
      return;
    }

    await this.sendLocalCommand(
      new PlaceOrderCommand({ payload: { orderId: order.unwrap().id } }),
    );

    this.completeSaga(message.correlationId);
  }

  private async handlePaymentRejected(
    message: IPaymentRejectedMessage,
  ): Promise<void> {
    const order = await this.sendLocalQuery<
      Result<GetOrderModel, DomainException>
    >(new GetOrderQuery({ params: { orderId: message.payload.paymentId } }));

    if (order.isErr) {
      console.error(order.safeUnwrap());
      return;
    }

    await this.sendLocalCommand(
      new CancelOrderCommand({ payload: { orderId: order.unwrap().id } }),
    );

    this.completeSaga(message.correlationId);
  }
}
