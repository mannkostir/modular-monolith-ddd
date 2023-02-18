import { PaginationQueryDto } from '@lib/base/communication/pagination.query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetManyItemsRequestDto extends PaginationQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
