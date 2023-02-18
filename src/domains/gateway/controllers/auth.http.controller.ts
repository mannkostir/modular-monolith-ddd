import { HttpController } from '@src/domains/gateway/base/http-controller';
import { NoContentResponseDecorator } from '@src/domains/gateway/decorators/no-content-response.decorator';
import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserCommand } from '@lib/communication/gateway-interface/user/commands/create-user/create-user.command';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@src/domains/gateway/auth/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SignUpRequestDto } from '@lib/communication/gateway-interface/user/commands/sign-in/sign-up.request.dto';
import { ResponseDecorator } from '@src/domains/gateway/decorators/response.decorator';
import { SignInResponseDto } from '@lib/communication/gateway-interface/user/commands/sign-in/sign-in.response.dto';
import { GenerateTokenCommand } from '@lib/communication/gateway-interface/user/commands/generate-token/generate-token.command';
import { ActorId } from '@src/domains/gateway/decorators/actor-id.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthHttpController extends HttpController {
  @ResponseDecorator(SignInResponseDto, 'Sign in')
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  private async signIn(
    @Query() body: SignUpRequestDto,
    @ActorId() userId: string,
  ): Promise<SignInResponseDto> {
    // const getUserResult = await this.queryBus.execute<
    //   GetUserQuery,
    //   Result<void, InvalidOperationDomainError>
    // >(new GetUserQuery({ params: body }));
    //
    // if (getUserResult.isErr) getUserResult.unwrap();

    const generateTokenResult = await this.commandBus.execute<
      GenerateTokenCommand,
      Result<string, InvalidOperationDomainError>
    >(
      new GenerateTokenCommand({
        payload: { email: body.email, userId },
      }),
    );

    const token = generateTokenResult.unwrap();

    return {
      userId,
      token,
    };
  }

  @NoContentResponseDecorator('Sign up')
  @Post('/sign-up')
  private async signUp(@Body() body: SignUpRequestDto) {
    const result = await this.commandBus.execute<
      CreateUserCommand,
      Result<void, InvalidOperationDomainError>
    >(new CreateUserCommand({ payload: body }));

    return result.unwrap();
  }
}
