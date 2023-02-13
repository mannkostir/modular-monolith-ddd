import { Order } from './order.type';
import { User } from './user.type';

export enum PaymentStatus {
  fulfilled = 'FULFILLED',
  pending = 'PENDING',
  rejected = 'REJECTED',
}

export type Payment = {
  id: string;
  order?: Order;
  orderId: string;
  userId: string;
  user?: User;
  status: PaymentStatus;
};
