import { HttpController } from '@src/domains/gateway/base/http-controller';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoContentResponseDecorator } from '@src/domains/gateway/decorators/no-content-response.decorator';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { CreateUserCommand } from '@lib/communication/gateway-interface/user/commands/create-user/create-user.command';
import { CreateUserRequestDto } from '@lib/communication/gateway-interface/user/commands/create-user/create-user.request.dto';
import { GetUserResponseDto } from '@lib/communication/gateway-interface/user/queries/get-user/get-user.response.dto';
import { ResponseDecorator } from '@src/domains/gateway/decorators/response.decorator';
import { GetUserRequestDto } from '@lib/communication/gateway-interface/user/queries/get-user/get-user.request.dto';
import { GetUserQuery } from '@lib/communication/gateway-interface/user/queries/get-user/get-user.query';
import { UuidParam } from '@src/domains/gateway/decorators/uuid-param.decorator';

@Controller('user')
@ApiTags('user')
export class UserHttpController extends HttpController {
  GetUserResponseDto;

  @NoContentResponseDecorator('Create user')
  @Post()
  private async createUser(@Body() body: CreateUserRequestDto) {
    const result = await this.commandBus.execute<
      CreateUserCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateUserCommand({ payload: body }));

    return result.unwrap();
  }

  @ResponseDecorator(GetUserResponseDto, 'Get user')
  @Get('/:id')
  private async getUser(
    @Query() query: GetUserRequestDto,
    @UuidParam('id') userId: string,
  ) {
    const result = await this.queryBus.execute<
      GetUserQuery,
      Result<void, InvalidOperationDomainError>
    >(new GetUserQuery({ params: { ...query, userId } }));

    return result.unwrap();
  }
}
