import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '@lib/interfaces/common/pagination-meta.type';
import { PaginatedResponseType } from '@lib/interfaces/common/paginated-response.type';

export class PaginatedResponse<ResponseItem>
  implements PaginatedResponseType<ResponseItem>
{
  data: ResponseItem[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  count: number;
  @ApiProperty()
  pageCount: number;
  @ApiProperty()
  total: number;

  constructor(data: ResponseItem[], meta: PaginationMeta) {
    this.data = data;
    this.page = meta.page;
    this.count = meta.count;
    this.pageCount = meta.pageCount;
    this.total = meta.total;
  }
}
