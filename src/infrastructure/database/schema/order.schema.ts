import { EntitySchema } from 'typeorm';
import { Order } from '../types/order.type';
import { OrderStatus } from '@src/domains/order/domain/types/order-status.type';

export const OrderSchema = new EntitySchema<Order>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    invoiceId: { type: 'uuid', nullable: true },
    orderStatus: {
      type: 'enum',
      nullable: false,
      default: OrderStatus.pending,
      enum: OrderStatus,
    },
    customerId: { type: 'uuid', nullable: false },
  },
  relations: {
    orderedItems: {
      target: 'OrderedItem',
      type: 'one-to-many',
      eager: true,
      inverseSide: 'order',
      cascade: true,
    },
    customer: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: true,
    },
  },
  name: 'Order',
});
