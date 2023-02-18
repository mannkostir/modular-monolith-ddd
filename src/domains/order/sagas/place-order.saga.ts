import { Saga, SagaState } from '@src/domains/integration/base/saga';
import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { IOrderConfirmedMessage } from '@lib/messages/order-confirmed.message.interface';
import { RequestPaymentMessage } from '@src/domains/order/messages/request-payment.message';
import { IPaymentFulfilledMessage } from '@lib/messages/payment-fulfilled.message.interface';
import { GetOrderQuery } from '@lib/communication/gateway-interface/order/queries/get-order/get-order.query';
import { GetOrderModel } from '@src/domains/order/queries/order/get-order/get-order.dao';
import { PlaceOrderCommand } from '@lib/communication/gateway-interface/order/commands/place-order/place-order.command';

type SagaData = SagaState;

export class PlaceOrderSaga
  extends Saga<SagaData>
  implements IHandleMessage<IOrderConfirmedMessage>
{
  execute(message: IOrderConfirmedMessage): Promise<void>;
  execute(message: IPaymentFulfilledMessage): Promise<void>;
  async execute(
    message: IOrderConfirmedMessage | IPaymentFulfilledMessage,
  ): Promise<void> {
    if (message.token === 'order_confirmed') {
      return this.handleOrderConfirmed(message as IOrderConfirmedMessage);
    }
    if (message.token === 'payment_fulfilled') {
      return this.handlePaymentFulfilled(message as IPaymentFulfilledMessage);
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
      new RequestPaymentMessage(message, { amount: message.payload.total }),
    );
  }

  private async handlePaymentFulfilled(
    message: IPaymentFulfilledMessage,
  ): Promise<void> {
    const order = await this.sendLocalQuery<GetOrderModel | undefined>(
      new GetOrderQuery({ params: { invoiceId: message.payload.paymentId } }),
    );

    if (!order || !order.invoiceId) return;

    await this.sendLocalCommand(
      new PlaceOrderCommand({ payload: { orderId: order.id } }),
    );
  }
}
