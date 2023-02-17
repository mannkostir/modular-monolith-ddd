import { EntitySchema } from 'typeorm';
import { OrderedItem } from '../types/ordered-item.type';

export const OrderedItemSchema = new EntitySchema<OrderedItem>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    quantity: { type: 'int', nullable: false, default: 1 },
  },
  relations: {
    order: {
      type: 'many-to-one',
      target: 'Order',
    },
    item: {
      type: 'many-to-one',
      target: 'Item',
    },
  },
  name: 'OrderedItem',
});
