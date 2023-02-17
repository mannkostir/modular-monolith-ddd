import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  PaymentEntity,
  PaymentProps,
} from '@src/domains/payment/domain/entities/payment.entity';
import { Payment } from '@src/infrastructure/database/types/payment.type';
import { Repository } from 'typeorm';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { PaymentOrmMapper } from '@src/domains/payment/persistence/payment/payment.orm-mapper';

export class PaymentRepository extends TypeormRepository<
  PaymentEntity,
  PaymentProps,
  Payment
> {
  constructor(
    repository: Repository<Payment>,
    unitOfWork: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new PaymentOrmMapper(), unitOfWork, correlationId);
  }
}
