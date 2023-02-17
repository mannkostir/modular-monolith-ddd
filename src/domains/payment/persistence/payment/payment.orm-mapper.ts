import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  PaymentEntity,
  PaymentProps,
} from '@src/domains/payment/domain/entities/payment.entity';
import { Payment } from '@src/infrastructure/database/types/payment.type';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';

export class PaymentOrmMapper extends OrmMapper<
  PaymentEntity,
  PaymentProps,
  Payment
> {
  protected getEntityConstructor(ormEntity: Payment): {
    new (props: any): PaymentEntity;
  } {
    return PaymentEntity;
  }

  protected async toDomainProps(ormEntity: Payment): Promise<PaymentProps> {
    return {
      status: ormEntity.status,
      amount: ormEntity.amount,
    };
  }

  protected async toOrmProps(
    entity: PaymentEntity,
  ): Promise<OrmEntityProps<Payment>> {
    const props = entity.getCopiedProps();

    return {
      status: props.status,
      amount: props.amount,
    };
  }
}
