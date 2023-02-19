import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/payment/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { CreatePaymentCommand } from './create-payment.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { PaymentEntity } from '@src/domains/payment/domain/entities/payment.entity';
import { EntityMutationResult } from '@lib/interfaces/ports/repository.interface';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { RubMoneyVO } from '@lib/value-objects/money.value-object';

@CqrsCommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(
    command: CreatePaymentCommand,
  ): Promise<Result<EntityMutationResult, InvalidOperationDomainError>> {
    const paymentRepository = this.unitOfWork.getPaymentRepository(
      command.correlationId,
    );

    const payment = PaymentEntity.create({
      amount: new RubMoneyVO(command.payload.amount),
      id: command.payload.paymentId
        ? new UuidVO(command.payload.paymentId)
        : undefined,
    });

    const saveResult = await paymentRepository.save(payment);
    if (saveResult.isErr)
      return Result.fail(
        new InvalidOperationDomainError('Не удалось создать платёж'),
      );

    return saveResult;
  }
}
