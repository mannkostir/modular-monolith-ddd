import { HttpController } from '@lib/base/common/http-controller';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetManyItemsRequestDto } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.request.dto';
import { GetManyItemsQuery } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.query';
import { ResponseDecorator } from '@lib/decorators/response.decorator';
import { GetManyItemsResponseDto } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.response.dto';
import { GetManyItemsQueryHandler } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.query-handler';

@Controller('item')
@ApiTags('item')
export class GetManyItemsHttpController extends HttpController {
  @ResponseDecorator(GetManyItemsResponseDto, 'Get many items')
  @Get()
  public async getManyItems(@Query() query: GetManyItemsRequestDto) {
    const result = await new GetManyItemsQueryHandler(this.moduleRef).execute(
      new GetManyItemsQuery({ params: query }),
    );

    return result.unwrap();
  }
}
