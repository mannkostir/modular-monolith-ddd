import { Command } from '@lib/base/communication/command';
import { AddItemToCatalogRequestDto } from './add-item-to-catalog.request.dto';

export class AddItemToCatalogCommand extends Command<AddItemToCatalogRequestDto> {}
