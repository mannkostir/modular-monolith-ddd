import { HttpController } from '@lib/base/common/http-controller';
import { ResponseDecorator } from '@lib/decorators/response.decorator';
import { SignInResponseDto } from '@src/domains/identity/queries/user/sign-in/sign-in.response.dto';
import { Public } from '@src/lib/auth/decorators/public.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInRequestDto } from '@src/domains/identity/queries/user/sign-in/sign-in.request.dto';
import { ActorId } from '@lib/decorators/actor-id.decorator';
import { GenerateTokenQuery } from '@src/domains/identity/queries/generate-token/generate-token.query';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class SignInHttpController extends HttpController {
  @ResponseDecorator(SignInResponseDto, 'Sign in')
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  private async signIn(
    @Body() body: SignInRequestDto,
    @ActorId() userId: string,
  ): Promise<SignInResponseDto> {
    const generateTokenResult = await this.queryBus.execute<
      GenerateTokenQuery,
      Result<string, InvalidOperationDomainError>
    >(
      new GenerateTokenQuery({
        params: { email: body.email, userId },
      }),
    );

    const token = generateTokenResult.unwrap();

    return {
      userId,
      token,
    };
  }
}
