import { HttpController } from '@lib/base/common/http-controller';
import { NoContentResponseDecorator } from '@lib/decorators/no-content-response.decorator';
import { Public } from '@src/lib/auth/decorators/public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { SignInRequestDto } from '@src/domains/identity/queries/user/sign-in/sign-in.request.dto';
import { CreateUserCommand } from '@src/domains/identity/commands/user/create-user/create-user.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class SignUpHttpController extends HttpController {
  @NoContentResponseDecorator('Sign up')
  @Public()
  @Post('/sign-up')
  private async signUp(@Body() body: SignInRequestDto) {
    const result = await this.commandBus.execute<
      CreateUserCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateUserCommand({ payload: body }));

    return result.unwrap();
  }
}
