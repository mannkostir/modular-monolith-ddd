import { Constructor } from '@lib/types/constructor.type';
import { DomainEvent } from '@lib/base/domain/domain-event';

export function AsyncEventsHandler(...events: Constructor<DomainEvent>[]) {
  return (target) => {
    Reflect.defineMetadata(
      'listenToAsyncEvents',
      events.map((event) => event.name),
      target,
    );
    return target;
  };
}
