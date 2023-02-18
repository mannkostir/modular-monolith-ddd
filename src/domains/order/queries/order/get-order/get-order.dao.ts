import {
  DaoParams,
  TypeormDao,
} from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { Order } from '@lib/communication/gateway-interface/order/queries/get-order/order.api-type';

export interface GetOrderParams extends DaoParams {
  invoiceId?: string;
  customerId?: string;
}

export type GetOrderModel = Order;

export class GetOrderDao extends TypeormDao<GetOrderModel, GetOrderParams> {
  protected prepareModel(
    params: GetOrderParams,
  ): Promise<GetOrderModel | undefined> {
    return this.getOne(params);
  }

  protected prepareQb(
    qb: ExtendedQueryBuilder<GetOrderModel>,
    params: GetOrderParams,
  ): ExtendedQueryBuilder<GetOrderModel> {
    qb.select([
      'order.id as id',
      'order."invoiceId" as "invoiceId"',
      'order."orderStatus" as status',
      'order."customerId" as "customerId"',
    ]).from('orders', 'order');

    if (params.invoiceId) {
      qb.andWhere('order."invoiceId" = :invoiceId', params);
    }
    if (params.customerId) {
      qb.andWhere('order."customerId" = :customerId', params);
    }

    return qb;
  }
}
