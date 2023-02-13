import { EntitySchema } from 'typeorm';
import { Item } from '../types/item.type';

export const ItemSchema = new EntitySchema<Item>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: true, primary: true },
    name: { type: 'text', nullable: false },
    price: { type: 'number', nullable: false },
  },
  name: 'Item',
});
