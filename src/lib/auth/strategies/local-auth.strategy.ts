import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestException } from '@nestjs/common';
import { ICompareEncryptedValues } from '../interfaces/encrypt-and-decrypt';
import { IGetOneUserForAuth } from '@lib/auth/interfaces/get-one-user-for-auth.interface';
import { AttachedUser } from '@lib/auth/interfaces/attached-user';

export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  private exception = new BadRequestException(
    'Неверное имя пользователя или пароль',
  );

  constructor(
    userField: string,
    private readonly userAuthRepository: IGetOneUserForAuth,
    private readonly crypto: ICompareEncryptedValues,
  ) {
    super({
      usernameField: userField,
    });
  }

  async validate(email: string, password: string): Promise<AttachedUser> {
    const userForAuth = await this.userAuthRepository.getUserByEmail(email);

    if (!userForAuth) throw this.exception;

    const isValid = await this.crypto.compare(password, userForAuth.password);

    if (!isValid) throw this.exception;

    return { id: userForAuth.id };
  }
}
