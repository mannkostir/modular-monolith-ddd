import { DomainPrimitive } from '../../types/domain-primitives.type';
import { Primitive } from '../../types/primitive.type';
import { ValueObject } from './value-object';

type ValueObjectProps<T> = T extends Primitive | Date ? DomainPrimitive<T> : T;

export class NullableValueObject<T> extends ValueObject<T> {
  constructor(props: ValueObjectProps<T> | null) {
    if (typeof props === 'object') {
      const typedProps = props as ValueObjectProps<Record<string, any>> | null;

      if (!typedProps) {
        super(null);
      } else {
        super(typedProps);
      }
    } else {
      const typedProps = props as ValueObjectProps<Primitive | Date | null>;

      if (!typedProps || typedProps.value === null) {
        super({ value: null });
      } else {
        super(typedProps);
      }
    }
  }

  public isNull(): boolean {
    if (typeof this.props === 'object') {
      const typedProps = this.props as ValueObjectProps<
        Record<string, any>
      > | null;

      return !typedProps;
    } else {
      const typedProps = this.props as ValueObjectProps<
        Primitive | Date | null
      >;

      return !typedProps || typedProps.value === null;
    }
  }
}
