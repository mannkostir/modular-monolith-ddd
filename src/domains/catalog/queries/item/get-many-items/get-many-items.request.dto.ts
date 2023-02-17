import { PaginationQueryDto } from '@lib/base/communication/pagination.query.dto';

export class GetManyItemsRequestDto extends PaginationQueryDto {
  name?: string;
}
