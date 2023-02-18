import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { GetOrderQuery } from '@src/domains/order/queries/order/get-order/get-order.query';
import {
  GetOrderDao,
  GetOrderModel,
} from '@src/domains/order/queries/order/get-order/get-order.dao';
import { Result } from '@lib/utils/result.util';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { DomainException } from '@lib/base/common/domain.exception';

@CqrsQueryHandler(GetOrderQuery)
export class GetOrderQueryHandler extends QueryHandler {
  async handle(
    query: GetOrderQuery,
  ): Promise<Result<GetOrderModel, DomainException>> {
    const getOrderModel = await new GetOrderDao(this.dataSource).execute(
      query.params || {},
    );
    // TODO: implement different type for query errors
    if (!getOrderModel)
      return Result.fail(new EntityNotFoundDomainError('Заказ не найден'));

    return Result.ok(getOrderModel);
  }
}
