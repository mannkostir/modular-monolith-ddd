import { AggregateRoot } from '@lib/base/domain/aggregate-root';

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
}
