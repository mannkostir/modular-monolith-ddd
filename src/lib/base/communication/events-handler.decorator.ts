import { DomainEvent } from '@lib/base/domain/domain-event';
import { Constructor } from '@lib/types/constructor.type';

export function EventsHandler(...events: Constructor<DomainEvent>[]) {
  return (target) => {
    Reflect.defineMetadata(
      'listenToEvents',
      events.map((event) => event.name),
      target,
    );
    return target;
  };
}
