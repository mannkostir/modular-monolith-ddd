import { Primitive } from './primitive.type';

export interface DomainPrimitive<T extends Primitive | Date> {
  value: T;
}
