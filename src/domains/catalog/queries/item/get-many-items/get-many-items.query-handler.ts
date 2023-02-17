import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { GetManyItemsQuery } from './get-many-items.query';
import { GetManyItemsDao } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.dao';
import { Result } from '@lib/utils/result.util';
import { GetManyItemsRequestDto } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.request.dto';

@CqrsQueryHandler(GetManyItemsQuery)
export class GetManyItemsQueryHandler extends QueryHandler {
  async handle(query: GetManyItemsQuery) {
    const getManyItemsModel = await new GetManyItemsDao(
      this.dataSource,
    ).execute(query.params as GetManyItemsRequestDto);

    return Result.ok(getManyItemsModel);
  }
}
