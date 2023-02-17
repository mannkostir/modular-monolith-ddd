import { EntitySchema } from 'typeorm';
import { Payment, PaymentStatus } from '../types/payment.type';

export const PaymentSchema = new EntitySchema<Payment>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    status: {
      enum: PaymentStatus,
      nullable: false,
      type: 'enum',
      default: PaymentStatus.pending,
    },
  },
  relations: {
    order: {
      type: 'one-to-one',
      target: 'Order',
      joinColumn: true,
    },
    user: {
      type: 'one-to-one',
      target: 'User',
      joinColumn: true,
    },
  },
  name: 'Payment',
});
