import { EntitySchema } from 'typeorm';
import { OrderedItem } from '../types/ordered-item.type';

export const OrderedItemSchema = new EntitySchema<OrderedItem>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    quantity: { type: 'int', nullable: false, default: 1 },
    itemId: { type: 'uuid', nullable: false },
    orderId: { type: 'uuid', nullable: false },
  },
  relations: {
    order: {
      type: 'many-to-one',
      target: 'Order',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
    item: {
      type: 'many-to-one',
      target: 'Item',
      onDelete: 'CASCADE',
    },
  },
  name: 'OrderedItem',
});
