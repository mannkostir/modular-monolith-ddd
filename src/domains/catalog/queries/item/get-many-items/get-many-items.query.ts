import { Query } from '@lib/base/communication/query';
import { GetManyItemsRequestDto } from './get-many-items.request.dto';

export class GetManyItemsQuery extends Query<GetManyItemsRequestDto> {}
