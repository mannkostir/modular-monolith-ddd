import { Command } from '@lib/base/communication/command';
import { RemoveItemFromCatalogRequestDto } from './remove-item-from-catalog.request.dto';

export class RemoveItemFromCatalogCommand extends Command<RemoveItemFromCatalogRequestDto> {}
