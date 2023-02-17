import { Message, MessageMeta } from '@lib/base/communication/message';
import {
  IRequestPaymentMessage,
  RequestPaymentPayload,
} from '@lib/messages/request-payment.message.interface';

export class RequestPaymentMessage
  extends Message<RequestPaymentPayload>
  implements IRequestPaymentMessage
{
  constructor(meta: MessageMeta, payload: RequestPaymentPayload) {
    super(meta, payload, 'request_payment', 'order');
  }
}
