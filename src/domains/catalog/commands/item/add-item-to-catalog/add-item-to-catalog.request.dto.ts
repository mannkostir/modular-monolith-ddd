import { IsInt, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCatalogRequestDto {
  @IsString()
  @ApiProperty()
  public readonly name!: string;
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly price!: number;
}
