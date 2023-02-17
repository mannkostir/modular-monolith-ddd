import { EntitySchema } from 'typeorm';
import { Order } from '../types/order.type';

export const OrderSchema = new EntitySchema<Order>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
  },
  relations: {
    orderedItems: {
      target: 'OrderedItem',
      type: 'one-to-many',
      eager: true,
    },
    customer: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: true,
    },
  },
  name: 'Order',
});
