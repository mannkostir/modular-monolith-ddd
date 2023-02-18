import * as bcrypt from 'bcrypt';
import { ValueObject } from '@lib/base/domain/value-object';

export class PasswordVO extends ValueObject<string> {
  constructor(hash: string) {
    if (!PasswordVO.isValidHash(hash)) {
      throw new Error(`${hash} is not a valid password hash`);
    }

    super({ value: hash });
  }

  public get value(): string {
    return this.props.value;
  }

  public static async generate(value: string): Promise<PasswordVO> {
    return new PasswordVO(bcrypt.hashSync(value, 10));
  }

  private static isValidHash(value: string): boolean {
    return /\$2b\$10\$.{22}.{31}/.test(value);
  }

  public async compare(decrypted: string): Promise<boolean> {
    return bcrypt.compare(decrypted, this.value);
  }
}
