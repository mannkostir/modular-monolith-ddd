import * as Crypto from 'crypto';
import { ValueObject } from '@lib/base/domain/value-object';
import { isHash } from 'class-validator';

export class HashVO extends ValueObject<string> {
  constructor(value: string) {
    if (!isHash(value, 'sha256'))
      throw new Error(`Value ${value} is not a valid hash`);

    super({ value });
  }

  public get value() {
    return this.props.value;
  }

  public static generateHash(value?: string): string {
    const token = value || Crypto.randomBytes(20).toString('hex');
    return Crypto.createHash('sha256').update(token).digest('hex');
  }
}
