import { Primitive } from '../types/primitive.type';
import { DomainPrimitive } from '../types/domain-primitives.type';

export type ValueObjectProps<T> = T extends Primitive | Date
  ? DomainPrimitive<T>
  : T;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<Primitive | Date>);
  constructor(
    props: ValueObjectProps<Record<string, unknown> | Array<unknown>>,
  );
  constructor(props: null);
  constructor(props: ValueObjectProps<T>) {
    this.props = props;
  }
}
