import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { ItemRemovedDomainEvent } from '@src/domains/catalog/domain/events/item-removed.domain-event';

export type ItemProps = {
  name: string;
  price: number;
};

export type CreateItemProps = {
  name: string;
  price: number;
};

export class ItemEntity extends AggregateRoot<ItemProps> {
  public static create(createProps: CreateItemProps) {
    return new ItemEntity({ props: { ...createProps } });
  }

  markAsRemoved() {
    this.addEvent(
      new ItemRemovedDomainEvent({
        aggregateId: this.id.value,
        payload: { itemId: this.id.value },
      }),
    );
  }
}
