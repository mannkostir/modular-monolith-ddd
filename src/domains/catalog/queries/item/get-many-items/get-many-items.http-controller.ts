import { HttpController } from '@lib/base/common/http-controller';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetManyItemsRequestDto } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.request.dto';
import { GetManyItemsQuery } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.query';
import { Result } from '@lib/utils/result.util';
import { GetManyItemsPaginatedModel } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.dao';
import { ResponseDecorator } from '@lib/decorators/response.decorator';
import { GetManyItemsResponseDto } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.response.dto';

@Controller('item')
@ApiTags('item')
export class GetManyItemsHttpController extends HttpController {
  @ResponseDecorator(GetManyItemsResponseDto, 'Get many items')
  @Get()
  public async getManyItems(@Query() query: GetManyItemsRequestDto) {
    const result = await this.queryBus.execute<
      GetManyItemsQuery,
      Result<GetManyItemsPaginatedModel, never>
    >(new GetManyItemsQuery({ params: query }));

    return result.unwrap();
  }
}
