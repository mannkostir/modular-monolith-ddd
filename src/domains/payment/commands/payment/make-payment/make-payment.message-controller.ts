import { MessageController } from '@lib/base/communication/message.controller';
import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { IRequestPaymentMessage } from '@lib/messages/request-payment.message.interface';
import { Injectable } from '@nestjs/common';
import { CreatePaymentCommand } from '@src/domains/payment/commands/payment/create-payment/create-payment.command';
import { Result } from '@lib/utils/result.util';
import { DomainException } from '@lib/base/common/domain.exception';
import { EntityMutationResult } from '@lib/interfaces/ports/repository.interface';
import { MakePaymentCommand } from '@src/domains/payment/commands/payment/make-payment/make-payment.command';

@Injectable()
export class MakePaymentMessageController
  extends MessageController
  implements IHandleMessage<IRequestPaymentMessage>
{
  async handle(message: IRequestPaymentMessage): Promise<void> {
    const createPaymentResult = await this.commandBus.execute<
      CreatePaymentCommand,
      Result<EntityMutationResult, DomainException>
    >(
      new CreatePaymentCommand({
        payload: {
          amount: message.payload.amount,
          paymentId: message.payload.invoiceId,
        },
        correlationId: message.correlationId,
      }),
    );
    if (createPaymentResult.isErr) {
      console.error(createPaymentResult.safeUnwrap());
      return;
    }

    const makePaymentResult = await this.commandBus.execute<
      MakePaymentCommand,
      Result<EntityMutationResult, DomainException>
    >(
      new MakePaymentCommand({
        payload: { invoiceId: createPaymentResult.unwrap().id.value },
        correlationId: message.correlationId,
      }),
    );
    if (makePaymentResult.isErr) {
      console.error(makePaymentResult.safeUnwrap());
      return;
    }
  }

  getMessagePattern(): string {
    return 'request_payment';
  }
}
