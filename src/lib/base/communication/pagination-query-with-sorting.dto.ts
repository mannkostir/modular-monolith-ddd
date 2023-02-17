import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderType } from '@lib/types/order.type';
import { PaginationQueryDto } from '@lib/base/communication/pagination.query.dto';
import { SortingQuery } from '@lib/interfaces/common/sorting-query.interface';

export class PaginationQueryWithSortingDto<SortField extends string = string>
  extends PaginationQueryDto
  implements SortingQuery<SortField>
{
  @IsOptional()
  @IsEnum(OrderType)
  order?: OrderType;
  @IsOptional()
  @IsString()
  sort?: SortField;
}
