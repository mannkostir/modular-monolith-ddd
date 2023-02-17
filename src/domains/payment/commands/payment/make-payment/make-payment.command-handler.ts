import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/domains/payment/persistence/unit-of-work';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { MakePaymentCommand } from './make-payment.command';
import { Result } from '@lib/utils/result.util';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { Exception } from '@lib/base/common/exception';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';

@CqrsCommandHandler(MakePaymentCommand)
export class MakePaymentCommandHandler extends CommandHandler<UnitOfWork> {
  async handle(command: MakePaymentCommand): Promise<Result<void, Exception>> {
    const paymentRepository = this.unitOfWork.getPaymentRepository(
      command.correlationId,
    );

    const payment = await paymentRepository.findOneById(
      new UuidVO(command.payload.invoiceId),
    );
    if (!payment)
      return Result.fail(new EntityNotFoundDomainError('Платёж не найден'));

    payment.attempt();

    return Result.ok();
  }
}
