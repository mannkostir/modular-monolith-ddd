import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { AddItemToCatalogRequestDto } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.request.dto';
import { AddItemToCatalogCommand } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.command';
import { Result } from '@lib/utils/result.util';
import { DomainException } from '@lib/base/common/domain.exception';
import { ApiTags } from '@nestjs/swagger';

@Controller('item')
@ApiTags('item')
export class AddItemToCatalogHttpController extends HttpController {
  @NoContentResponseDecorator('Add item to catalog')
  @Post()
  public async addItemToCatalog(@Body() body: AddItemToCatalogRequestDto) {
    const result = await this.commandBus.execute<
      AddItemToCatalogCommand,
      Result<void, DomainException>
    >(new AddItemToCatalogCommand({ payload: body }));

    return result.unwrap();
  }
}
