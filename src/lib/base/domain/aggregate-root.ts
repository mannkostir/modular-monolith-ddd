import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<
  EntityProps extends Record<string, any> = Record<string, any>,
> extends Entity<EntityProps> {
  public isDomainProcessed = false;

  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents.sort((event1, event2) =>
      event1.dateOccurred > event2.dateOccurred ? 1 : 0,
    );
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  protected addEvent(domainEvent: DomainEvent): void {
    if (this._domainEvents.some((event) => event.token === domainEvent.token))
      return;

    this._domainEvents.push(domainEvent);
  }
}
