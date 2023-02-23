import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { AddItemToCatalogRequestDto } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.request.dto';
import { AddItemToCatalogCommand } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.command';
import { ApiTags } from '@nestjs/swagger';
import { AddItemToCatalogCommandHandler } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.command-handler';

@Controller('item')
@ApiTags('item')
export class AddItemToCatalogHttpController extends HttpController {
  @NoContentResponseDecorator('Add item to catalog')
  @Post()
  public async addItemToCatalog(@Body() body: AddItemToCatalogRequestDto) {
    const result = await new AddItemToCatalogCommandHandler(
      this.moduleRef,
    ).execute(new AddItemToCatalogCommand({ payload: body }));

    return result.unwrap();
  }
}
