import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { PaymentStatus } from '@src/domains/payment/domain/types/payment-status.type';
import { PaymentFulfilledDomainEvent } from '@src/domains/payment/domain/events/payment-fulfilled.domain-event';
import { PaymentRejectedDomainEvent } from '@src/domains/payment/domain/events/payment-rejected.domain-event';

export type PaymentProps = {
  status: PaymentStatus;
  amount: number;
};

export type CreatePaymentProps = Omit<PaymentProps, 'status'>;

export class PaymentEntity extends AggregateRoot<PaymentProps> {
  public static create(createProps: CreatePaymentProps): PaymentEntity {
    return new PaymentEntity({
      props: { ...createProps, status: PaymentStatus.pending },
    });
  }

  public attempt(): void {
    if (Math.floor(Math.random() * (10 + 1)) >= 5) {
      this.props.status = PaymentStatus.fulfilled;
      this.addEvent(
        new PaymentFulfilledDomainEvent({
          payload: { paymentId: this.id.value },
          aggregateId: this.id.value,
        }),
      );
    } else {
      this.props.status = PaymentStatus.rejected;
      this.addEvent(
        new PaymentRejectedDomainEvent({
          aggregateId: this.id.value,
          payload: { paymentId: this.id.value },
        }),
      );
    }
  }
}