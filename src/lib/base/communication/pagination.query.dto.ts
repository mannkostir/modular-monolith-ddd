import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';

export class PaginationQueryDto implements PaginationQuery {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit!: number;
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page!: number;
}
