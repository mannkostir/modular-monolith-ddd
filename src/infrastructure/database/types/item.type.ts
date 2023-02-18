import { OrderedItem } from '@src/infrastructure/database/types/ordered-item.type';

export type Item = {
  id: string;

  name: string;

  price: number;

  orderedItems: OrderedItem[];

  createdAt: Date;
};
