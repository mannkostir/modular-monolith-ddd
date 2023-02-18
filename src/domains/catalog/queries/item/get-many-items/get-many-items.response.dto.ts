import { PaginatedResponse } from '@lib/base/common/paginated.response';
import { GetManyItemsModel } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.dao';

export class GetManyItemsResponseDto extends PaginatedResponse<GetManyItemsModel> {}
