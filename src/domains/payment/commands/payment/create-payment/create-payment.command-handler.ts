import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/payment/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { CreatePaymentCommand } from './create-payment.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { PaymentEntity } from '@src/domains/payment/domain/entities/payment.entity';

@CqrsCommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: CreatePaymentCommand,
  ): Promise<Result<void, InvalidOperationDomainError>> {
    const paymentRepository = this.unitOfWork.getPaymentRepository(
      command.correlationId,
    );

    const payment = PaymentEntity.create({ amount: command.payload.amount });

    const saveResult = await paymentRepository.save(payment);
    if (saveResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Не удалось создать платёж'),
      );

    return Result.ok();
  }
}
