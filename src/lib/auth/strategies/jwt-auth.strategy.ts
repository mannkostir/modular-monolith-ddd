import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IGetUserById } from '../interfaces/check-user-existence.interface';
import { Injectable } from '@nestjs/common';
import { AttachedUser } from '@lib/auth/interfaces/attached-user';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(secret: string, private readonly userRepository: IGetUserById) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    email: string;
    id: string;
  }): Promise<AttachedUser | undefined> {
    return this.userRepository.getUserById(payload.id);
  }
}
