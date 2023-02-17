import { ValueObject } from '@lib/base/domain/value-object';
import { isUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';

abstract class UuidVOBase extends ValueObject<string> {
  public abstract get value(): string | null;

  public abstract get isNull(): boolean;

  public abstract isEqualTo(uuid: UuidVO): boolean;
}

class NotNullUuid extends UuidVOBase {
  public isNull = false as const;

  constructor(value: string) {
    if (!isUUID(value)) {
      throw new Error(`Value ${value} is not a valid UUID`);
    }
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  isEqualTo(uuid: UuidVO): boolean {
    return this.props.value === uuid.value;
  }
}

class NullUuid extends UuidVOBase {
  public isNull = true as const;

  constructor() {
    super({ value: null });
  }

  get value(): null {
    return null;
  }

  isEqualTo(uuid: UuidVO): false {
    return false;
  }
}

export type UuidVO = NotNullUuid | NullUuid;

export class UuidVOFactory {
  public generate(): NotNullUuid {
    return new NotNullUuid(uuid());
  }

  public create(value?: string | null) {
    if (!value) {
      return new NullUuid();
    }
    return new NotNullUuid(value);
  }
}
