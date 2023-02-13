import { EntitySchema } from 'typeorm';
import { Order } from '../types/order.type';

export const OrderSchema = new EntitySchema<Order>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: true, primary: true },
  },
  relations: {
    orderedItems: {
      target: 'OrderedItem',
      type: 'one-to-many',
    },
    customer: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: true,
    },
  },
  name: 'Order',
});
