import { DomainEvent } from '@lib/base/domain/domain-event';

type Payload = {
  itemId: string;
};

export class ItemRemovedDomainEvent extends DomainEvent<Payload> {
  token = 'item_removed';
}
