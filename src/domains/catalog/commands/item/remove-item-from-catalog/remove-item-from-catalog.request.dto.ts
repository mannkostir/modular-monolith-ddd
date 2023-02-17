import { IsUUID } from 'class-validator';

export class RemoveItemFromCatalogRequestDto {
  @IsUUID()
  itemId!: string;
}
