import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICheckUserExistence } from '../interfaces/check-user-existence.interface';

export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    secret: string,
    private readonly userRepository: ICheckUserExistence,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    email: string;
    payload: { id: string };
  }): Promise<boolean> {
    return this.userRepository.doesUserExistsById(payload.payload.id);
  }
}
