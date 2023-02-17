import { EntitySchema } from 'typeorm';
import { Payment, PaymentStatus } from '../types/payment.type';

export const PaymentSchema = new EntitySchema<Payment>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    amount: { type: 'int', nullable: false },
    status: {
      enum: PaymentStatus,
      nullable: false,
      type: 'enum',
      default: PaymentStatus.pending,
    },
  },
  name: 'Payment',
});
