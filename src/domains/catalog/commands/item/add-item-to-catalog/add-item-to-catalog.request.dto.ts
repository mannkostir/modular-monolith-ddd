import { IsNumberString, IsString } from 'class-validator';

export class AddItemToCatalogRequestDto {
  @IsString()
  public readonly name!: string;
  @IsNumberString()
  public readonly price!: number;
}
