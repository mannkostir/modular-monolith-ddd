import { User } from './user.type';
import { Item } from './item.type';

export type Order = {
  id: string;

  customer?: User;

  orderedItems?: Item[];

  createdAt: Date;
};
