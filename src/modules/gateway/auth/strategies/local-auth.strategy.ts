import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IGetOneUser } from '../interfaces/get-one-user.interface';
import { BadRequestException } from '@nestjs/common';
import { IEncryptAndDecrypt } from '../interfaces/encrypt-and-decrypt';

export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  private exception = new BadRequestException(
    'Неверное имя пользователя или пароль',
  );

  constructor(
    userField: string,
    private readonly userRepository: IGetOneUser,
    private readonly crypto: IEncryptAndDecrypt,
  ) {
    super({
      usernameField: userField,
    });
  }

  async validate(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) throw this.exception;

    const isValid = await this.crypto.compare(password, user.password);

    if (!isValid) throw this.exception;

    return true;
  }
}
