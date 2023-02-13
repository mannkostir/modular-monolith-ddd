import { isUUID } from 'class-validator';
import { NullableValueObject } from '../base/nullable-value-object';
import { v4 as uuid } from 'uuid';

export class UuidVO extends NullableValueObject<string> {
  constructor(value: string | null) {
    if (value && !isUUID(value)) {
      throw new Error(`Value ${value} is not a valid UUID`);
    }
    super({ value });
  }

  public get value(): string | null {
    return this.props.value;
  }

  public static generate(): UuidVO {
    return new UuidVO(uuid());
  }

  public isEqualTo(id: UuidVO): boolean {
    return this.props.value === id.value;
  }
}
