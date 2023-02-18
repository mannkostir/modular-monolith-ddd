import { OrderStatus } from '@src/domains/order/domain/types/order-status.type';

export type Order = {
  id: string;

  invoiceId: string;

  status: OrderStatus;

  customerId: string;
};
