import { Order } from './order.type';
import { Item } from './item.type';

export type OrderedItem = {
  id: string;
  orderId: string;
  order?: Order;
  itemId: string;
  item?: Item;
  quantity: number;
  createdAt: Date;
};
