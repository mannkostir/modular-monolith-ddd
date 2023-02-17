import { ValueObject } from '@lib/base/domain/value-object';
import { isUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class UuidVO extends ValueObject<string> {
  constructor(value: string) {
    if (!isUUID(value)) {
      throw new Error(`Value ${value} is not a valid UUID`);
    }
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  public static generate(): UuidVO {
    return new UuidVO(uuid());
  }

  isEqualTo(uuid: UuidVO): boolean {
    return this.props.value === uuid.value;
  }
}
