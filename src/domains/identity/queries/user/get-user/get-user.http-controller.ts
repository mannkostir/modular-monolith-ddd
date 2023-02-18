import { HttpController } from '@lib/base/common/http-controller';
import { ResponseDecorator } from '@lib/decorators/response.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { GetUserRequestDto } from '@src/domains/identity/queries/user/get-user/get-user.request.dto';
import { UuidParam } from '@lib/decorators/uuid-param.decorator';
import { GetUserQuery } from '@src/domains/identity/queries/user/get-user/get-user.query';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';
import { GetUserResponseDto } from '@src/domains/identity/queries/user/get-user/get-user.response.dto';
import { GetUserModel } from '@src/domains/identity/queries/user/get-user/get-user.dao';

@Controller('user')
@ApiTags('user')
export class GetUserHttpController extends HttpController {
  @ResponseDecorator(GetUserResponseDto, 'Get user')
  @Get('/:id')
  private async getUser(
    @Query() query: GetUserRequestDto,
    @UuidParam('id') userId: string,
  ) {
    const result = await this.queryBus.execute<
      GetUserQuery,
      Result<GetUserModel, InvalidOperationDomainError>
    >(new GetUserQuery({ params: { ...query, userId } }));

    return result.unwrap();
  }
}
