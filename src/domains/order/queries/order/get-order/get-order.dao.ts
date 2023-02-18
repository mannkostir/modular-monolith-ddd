import {
  DaoParams,
  TypeormDao,
} from '@src/infrastructure/database/base/typeorm.dao';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { OrderStatus } from '@src/domains/order/domain/types/order-status.type';

export interface GetOrderParams extends DaoParams {
  invoiceId?: string;
  customerId?: string;
}

export type GetOrderModel = {
  id: string;

  invoiceId: string;

  status: OrderStatus;

  customerId: string;
};

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
      'o.id as id',
      'o."invoiceId" as "invoiceId"',
      'o."orderStatus" as status',
      'o."customerId" as "customerId"',
    ]).from('order', 'o');

    if (params.invoiceId) {
      qb.andWhere('o."invoiceId" = :invoiceId', params);
    }
    if (params.customerId) {
      qb.andWhere('o."customerId" = :customerId', params);
    }

    return qb;
  }
}
