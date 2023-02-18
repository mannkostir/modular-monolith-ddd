import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from '@src/domains/identity/commands/user/create-user/create-user.request.dto';
import { CreateUserCommand } from '@src/domains/identity/commands/user/create-user/create-user.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class CreateUserHttpController extends HttpController {
  @NoContentResponseDecorator('Create user')
  @Post()
  private async createUser(@Body() body: CreateUserRequestDto) {
    const result = await this.commandBus.execute<
      CreateUserCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateUserCommand({ payload: body }));

    return result.unwrap();
  }
}
