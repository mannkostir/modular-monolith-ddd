import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto implements PaginationQuery {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @ApiProperty()
  limit!: number;
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @ApiProperty()
  page!: number;
}
