import { User } from './user.type';
import { OrderedItem } from '@src/infrastructure/database/types/ordered-item.type';
import { OrderStatus } from '@src/infrastructure/database/types/order-status.type';

export type Order = {
  id: string;

  customer?: User;

  customerId: string;

  orderedItems: OrderedItem[];

  createdAt: Date;

  orderStatus: OrderStatus;

  invoiceId: string;
};
